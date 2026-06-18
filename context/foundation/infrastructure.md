---
project: Wzrusz
researched_at: 2026-05-25
recommended_platform: AWS (Elastic Beanstalk web SSR + EB API + RDS)
runner_up: Railway
context_type: mvp
tech_stack:
  language: TypeScript
  framework: Angular 21 + NestJS 11
  runtime: Node.js (Nx monorepo)
---

## Recommendation

**Deploy on AWS: Elastic Beanstalk (Angular SSR web + Nest API) + RDS PostgreSQL + S3 (media) + SES.**

> **Update 2026-05-31:** Produkcja wymaga SEO → front to **Angular SSR na EB** (`wzrusz-web`), nie Amplify static / S3-only SPA. S3 nadal na upload zdjęć dekoracji.

Stack w `tech-stack.md` już wskazuje AWS; wywiad potwierdził: brak persistent connections (Q1=No), równowaga koszt/DX (Q2), doświadczenie AWS (Q3), jeden region PL (Q4), co-location usług (Q5). Nx monorepo z Nest wymaga always-on Node — Vercel/Netlify serverless-only odpadają na warstwie API. AWS daje jednego vendora na front CDN, API, Postgres, obrazy dekoracji i maile (FR-011, FR-026), zgodnie z `@context/foundation/brand-and-scaffold.md`.

## Platform Comparison

Hard filter: NestJS 11 + PostgreSQL → wykluczone jako **jedyny** host full-stack: Vercel/Netlify (API serverless-only), Cloudflare Workers (brak natywnego long-running Nest bez adapterów).

| Platform | CLI-first | Managed/Serverless | Agent-readable docs | Stable deploy API | MCP / Integration | Total |
|---|---|---|---|---|---|---|
| **AWS** | Partial | Partial | Partial | Pass | Partial | **4P + 1Pa** |
| **Railway** | Pass | Pass | Partial | Pass | Partial | **3P + 2Pa** |
| **Render** | Pass | Pass | Partial | Pass | Partial | **3P + 2Pa** |
| **Fly.io** | Pass | Pass | Pass (MDX GitHub) | Pass | Fail | 3P + 2Pa |
| **Cloudflare** | Pass | Pass | Pass (llms.txt) | Pass | Pass | 2P + 3Pa* |
| **Vercel** | Pass | Pass | Pass (MDX) | Pass | Partial (MCP beta) | 2P + 3Pa* |
| **Netlify** | Pass | Pass | Partial | Pass | Pass (MCP) | 2P + 3Pa* |

\*Cloudflare/Vercel/Netlify: Pass na froncie SPA, **Partial overall** — Nest API wymaga osobnej platformy lub przepisania; łamie Q5 co-location.

### Shortlisted Platforms

#### 1. AWS (Amplify + EB + RDS) — Recommended

Jeden vendor na SPA (`nx build web` → Amplify/CloudFront), Nest na EB Node platform, RDS PostgreSQL, S3 na uploady, SES na emaile, Secrets Manager na JWT/DB. GitHub Actions + `aws-actions/aws-elasticbeanstalk-deploy` daje scriptable deploy API. Znajomość AWS (Q3) i architektura z brand-and-scaffold skracają decyzje.

#### 2. Railway

`railway up` / CLI + managed Postgres w jednym projekcie — świetny DX dla solo MVP (~$5/mo Hobby + usage). Istnieją guide’y Nx Angular+Nest. **Gap vs AWS:** brak natywnego SES, S3-compatible storage osobno; Q5 co-location słabsze; mniejsza znajomość u Ciebie.

#### 3. Render

`render deploys create`, Blueprint `render.yaml` (IaC całego stacku), Render Postgres, web service dla Nest — zero-downtime deploys. **Gap vs AWS:** podobnie jak Railway — SES/S3 poza platformą; więcej ręcznego składania niż gotowy szkic AWS w brand-and-scaffold.

## Anti-Bias Cross-Check: AWS

### Devil's Advocate — Weaknesses

1. **Operacyjna złożoność MVP** — Amplify + EB + RDS + SES + 2× S3 to 5+ usług; pierwsze wdrożenie solo after-hours może zająć weekend, nie wieczór (IAM roles, security groups, CORS między domenami).
2. **Koszt idle** — RDS `db.t4g.micro` + EB environment + Amplify nawet przy niskim ruchu to ~$30–50/mo vs Railway Hobby ~$5–15; przy Q2 „równowaga” AWS nie wygrywa na cenie.
3. **CLI ≠ pełna automatyzacja** — część kroków (ACM cert, Route53, SES sandbox exit, IAM Instance Profile dla EB) wymaga konsoli; agent blokuje się na „kliknij w panelu”.
4. **Nx monorepo w CI** — build musi targetować `apps/web` i `apps/api` osobno; zły `amplify.yml` / EB artifact path = pusty deploy; łatwy błąd przy pierwszym pipeline.
5. **Rollback nie jest atomowy** — front (Amplify) i API (EB) rollbackują się osobno; migracja RDS nie cofa się automatycznie przy revert API.

### Pre-Mortem — How This Could Fail

Założyliśmy, że „Amplify + EB + RDS” wystarczy na 3 tygodnie after-hours. Tydzień 1 poszedł na IAM i security groups — agent generował polityki z `*` na S3. Tydzień 2: SES w sandboxie nie wysyła do klientów spoza zweryfikowanych adresów; admin klika „wyślij sukces” i nic nie dociera — bug uznany za aplikacyjny. Tydzień 3: deploy API na EB bez `PORT` binding na `0.0.0.0` — health check fail, środowisko w loopie. Równolegle Angular woła `/api` na localhost w prod, bo env nie podmieniony w buildzie. Decyzja o AWS bez szablonu IaC (CDK/Terraform) oznacza, że staging i prod rozjechały się ręcznie. Po 6 miesiącach RDS backup retention = default 1 day — przypadkowy `DROP` w migracji Nest TypeORM i dane dekoracji przepadły. Koszt „znajomości AWS” okazał się kosztem utrzymania pięciu usług bez jednego `render.yaml`.

### Unknown Unknowns

- **SES sandbox** — nowe konto AWS wysyła tylko do zweryfikowanych adresów; produkcyjne emaile do klientów wymagają ticketu do AWS Support (24–48h).
- **Amplify monorepo root** — Amplify musi wiedzieć, że build jest w `wzrusz/` i output w `dist/apps/web/browser`; domyślny detector trafia w zły katalog.
- **EB Node + webpack Nest** — Nx buduje API do `dist/apps/api/`; EB oczekuje `package.json` + `node_modules` w paczce — potrzebny `nx prune` / `@nx/js:prune-lockfile` w pipeline (już skonfigurowane w `@apps/api/project.json`).
- **CORS + cookies** — front na `*.amplifyapp.com`, API na `*.elasticbeanstalk.com` — JWT w cookie wymaga explicit domain config; łatwo przeoczyć przy MVP auth.
- **AWS MCP** — AWS API MCP Server istnieje (preview, region-limited, wymaga Cognito/IAM setup) — nie jest drop-in jak Netlify MCP; na MVP licz na CLI + GitHub Actions, nie na MCP.

## Operational Story

- **Preview deploys**: Amplify branch previews per PR (`amplify.yml` w repo); EB — osobne środowisko `wzrusz-api-staging` lub manual deploy z innym `version-label`. Ochrona preview: opcjonalnie CloudFront/WAF lub basic auth na staging — na MVP wystarczy niepublikowany URL Amplify.
- **Secrets**: GitHub Secrets → `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` (scoped IAM: Amplify + EB deploy + S3 upload); EB env vars dla `DATABASE_URL`, `JWT_SECRET`; Secrets Manager dla RDS rotation (v2). Agent czyta env przez workflow, nie commituje `.env`.
- **Rollback**: Front — Amplify Console „Redeploy this version” lub redeploy poprzedniego commita; API — `aws elasticbeanstalk update-environment` z poprzednim `version-label` z S3; typowy czas 5–15 min. **Uwaga:** migracje DB nie rollbackują — przed prod deploy robić backup RDS snapshot.
- **Approval**: Agent może: build, upload artifact, deploy staging. **Human-only**: prod deploy (`--prod`), SES production access, drop RDS, rotate primary JWT secret, delete EB environment.
- **Logs**: `aws logs tail /aws/elasticbeanstalk/wzrusz-api/var/log/web.stdout --follow`; Amplify build logs w Console lub GitHub Actions; `eb logs` jeśli EB CLI zainstalowane lokalnie.

## Risk Register

| Risk | Source | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| SES sandbox blokuje emaile do klientów | Unknown unknowns | H | H | Weryfikacja domeny + wniosek o production access przed testem FR-026 |
| Zły path buildu Nx w Amplify/EB | Devil's advocate | M | H | Szablon `amplify.yml` i EB deploy z explicit `dist/apps/web/browser` i `dist/apps/api` |
| IAM over-permissive w CI | Pre-mortem | M | H | Osobny IAM user: AmplifyDeploy + EBDeploy + S3Images only; review polityk |
| Front woła localhost API w prod | Pre-mortem | M | H | `environment.prod.ts` + proxy tylko dev; API URL z env w build CI |
| RDS bez backupów | Pre-mortem | L | H | Retention ≥7 dni, snapshot przed pierwszą migracją |
| Koszt idle > budżet solo | Devil's advocate | M | M | RDS micro + EB single instance; CloudWatch billing alarm; rozważyć Railway na staging |

## Getting Started

1. **AWS CLI** — `aws configure`; region `eu-central-1`.
2. **EB web SSR** — app `wzrusz-web`, deploy zip z `dist/apps/web/` (`node server/server.mjs`), env `PORT=8080`, `HOST=0.0.0.0`.
3. **EB API** — app `wzrusz-api`, deploy `dist/apps/api` po `nx build api` + prune.
4. **RDS PostgreSQL** — `db.t4g.micro`, VPC shared z EB API.
5. **GitHub Actions** — `@wzrusz/.github/workflows/deploy-web.yml` + `deploy-api.yml`; variable `NX_API_URL` dla buildu SSR.

## Out of Scope

- Docker/ECS Fargate (upgrade path po MVP, nie day-1)
- CI/CD pełna konfiguracja (osobny krok / Plan Mode deploy)
- Multi-region HA, DR, SLA
- Cloudflare/Vercel jako primary (odfiltrowane przez Nest + co-location)
