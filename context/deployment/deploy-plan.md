---
project: Wzrusz
planned_at: 2026-05-31
status: draft
platform: AWS (Elastic Beanstalk ×2 + RDS PostgreSQL + S3 media)
region: eu-central-1
monorepo_root: wzrusz/
rendering: angular-ssr
approved_by: null
---

# Deploy Plan — Wzrusz MVP (walking skeleton)

Plan pierwszego wdrożenia zgodny z `@context/foundation/infrastructure.md` i `@context/foundation/tech-stack.md`.

**Decyzja produktowa (2026-05-31):** produkcja wymaga **SEO** → Angular **SSR** (`RenderMode.Server` na trasach publicznych), nie statyczny CSR na S3/Amplify.

Cel fazy 0: **live URL frontu (SSR) + live URL API + RDS** — bez pełnych feature’ów PRD, bez SES/S3 obrazów dekoracji (kolejna faza).

## Scope tej fazy

| W scope | Poza scope (faza 1+) |
|---|---|
| EB `wzrusz-web`: Angular SSR (`server/server.mjs`) | SES production + szablony maili |
| EB `wzrusz-api`: Nest hello `/api` | S3 bucket na upload zdjęć dekoracji |
| RDS PostgreSQL (pusta instancja) | Migracje TypeORM / dane |
| GitHub Actions → EB (web + api) | Auth admin, domena własna |
| Meta/Title SEO na publicznych trasach | CloudFront przed web EB (opcjonalnie v2) |

## Architektura docelowa (faza 0)

```
[Browser / Googlebot]
        ↓
   EB wzrusz-web (Node 20, port 8080)
        ├── SSR HTML (Angular @angular/ssr)
        └── static assets z dist/.../browser/
        ↓ API calls
   EB wzrusz-api → /api/*
        ↓
   RDS PostgreSQL

S3 (osobny bucket) — tylko zdjęcia dekoracji (admin upload), NIE hosting Angulara.
```

**Dlaczego nie Amplify static / S3-only front:** SSR wymaga **always-on Node** renderującego HTML per request. S3 trzyma pliki, ale nie wykonuje Angular SSR.

**Render modes** (`apps/web/src/app/app.routes.server.ts`):

- `admin/**` → `Client` (bez SEO, mniej problemów z auth/PrimeNG)
- `**` (public) → `Server` (SEO, dynamiczne meta z API w implementacji)

Lokalnie: `nx serve web` (dev SSR) + proxy `/api` → Nest. Prod: front woła **pełny URL** API EB (`NX_API_URL` w build CI).

---

## Faza A — Manual gates (Ty, konsola AWS)

### A1. Konto i region

- [ ] Konto AWS, billing alarm (~$25–40/mo — **dwa** EB + RDS), region `eu-central-1`
- [ ] `aws configure` (profil `wzrusz`)

### A2. IAM użytkownik CI/deploy

- [ ] IAM user `wzrusz-deploy` (programmatic only)
- [ ] Polityki: Elastic Beanstalk deploy (web + api), S3 EB artifact bucket — **bez** Amplify
- [ ] GitHub Secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`

### A3. RDS PostgreSQL

- [ ] `db.t4g.micro`, PostgreSQL 16, SG: 5432 tylko z SG EB API
- [ ] `DATABASE_URL` → env EB API (Secrets Manager później)
- [ ] Backup retention ≥ 7 dni

### A4. Elastic Beanstalk — API (`wzrusz-api`)

- [ ] Env: `wzrusz-api-staging`, Node.js 20 AL2023
- [ ] Env vars: `NODE_ENV=production`, `PORT=8080`, `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN=https://<web-eb-url>`
- [ ] Health check path: `/api/health`

### A5. Elastic Beanstalk — Web SSR (`wzrusz-web`)

- [ ] Env: `wzrusz-web-staging`, Node.js 20 AL2023
- [ ] Env vars: `NODE_ENV=production`, `PORT=8080`, `HOST=0.0.0.0`
- [ ] Build-time (GitHub Actions **variable**): `NX_API_URL=http://<api-eb-cname>` — bez trailing slash; **nie** skrócony hostname `env-name.region.elasticbeanstalk.com` (nie istnieje w DNS). Przykład staging: `http://Wzrusz-api-staging-env.eba-umryzx3z.eu-central-1.elasticbeanstalk.com` (CNAME z EB Console → Configuration → Domain)
- [ ] Start command (w paczce deploy): `node server/server.mjs` via `package.json` `start`
- [ ] Health: `/` (SSR zwraca 200)

### A6. SES (przygotowanie)

- [ ] Weryfikacja domeny + production access przed testem maili — `@context/foundation/lessons.md`

---

## Faza B — Repo

| Plik | Status |
|---|---|
| SSR w `apps/web` (`server.ts`, `app.routes.server.ts`) | ✅ włączone |
| `.github/workflows/deploy-web.yml` | ✅ |
| `.github/workflows/deploy-api.yml` | ✅ |
| `amplify.yml` | ❌ usunięte (CSR-only) |
| `apps/api/src/main.ts` CORS + `0.0.0.0` | ✅ |
| `apps/api` health `/api/health` | ✅ |
| `core/api/api-config.ts` + `NX_API_URL` build inject | ✅ |
| `Title` / Meta na home | ✅ |

### B1. Build lokalny

```bash
cd wzrusz
npm ci --legacy-peer-deps
npx nx run web:build --configuration=production
node dist/apps/web/server/server.mjs   # PORT=4000, sprawdź View Source = HTML z treścią
npx nx run api:build --configuration=production
npx nx run api:prune
```

Artefakty:

- Web SSR: `dist/apps/web/server/` + `dist/apps/web/browser/`
- API: `dist/apps/api/` (po prune)

### B2. Git + GitHub

- [ ] Repo na GitHub
- [ ] GitHub **variable** `NX_API_URL` (URL API EB)
- [ ] Push `main` → oba workflowy

---

## Faza C — GitHub Actions

| Workflow | Target | Artifact |
|---|---|---|
| `deploy-web.yml` | `wzrusz-web-staging` | zip `dist/apps/web/` + minimal `package.json` |
| `deploy-api.yml` | `wzrusz-api-staging` | zip `dist/apps/api/` |

Po deploy web: ustaw `CORS_ORIGIN` na API = URL web EB.

---

## Faza D — Weryfikacja

| # | Test | Oczekiwany wynik |
|---|---|---|
| 1 | `curl -s https://<web-eb>/ \| head` | HTML z renderowaną treścią (nie pusty shell) |
| 2 | View Source w przeglądarce | `<app-root>` ma content / hydration markers |
| 3 | `curl https://<api-eb>/api` | `{"message":"Hello API"}` |
| 4 | Google Rich Results / Search Console (później) | indeksowalne URL katalogu |
| 5 | EB oba env | Green |

---

## Rollback

| Warstwa | Akcja |
|---|---|
| Web SSR | EB redeploy poprzedni `version-label` |
| API | j.w. |
| RDS | Snapshot restore (**human-only**) |

---

## Human-only

- Drop/restore RDS, rotate JWT prod, SES production access, delete EB envs

---

## Kolejność

```
A1 → A2 → A3 → A4 (api EB) → A5 (web EB) → B (push) → C → D
Ustaw CORS_ORIGIN po znanym web URL.
```

---

## Zatwierdzenie

- [ ] Plan zaakceptowany (SSR + dual EB)
- [ ] `approved_by`: _______________
