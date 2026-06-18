---
change_id: media-storage-enabler
title: S3 decoration image upload path
status: archived
created: 2026-06-16
updated: 2026-06-18
archived_at: 2026-06-18T20:15:17Z
---

## Notes

**Roadmap:** F-03 (Stream D)  
**PRD:** FR-005, FR-018  
**Odblokowuje:** pełny upload zdjęć w S-07

### AWS (staging)

- [x] Bucket `wzrusz-media-staging` (eu-central-1), public read `decorations/*`.
- [x] IAM `WzruszEbSesS3` na roli EB.
- [x] EB env: `MEDIA_MODE=s3`, `S3_MEDIA_BUCKET`, `S3_MEDIA_PREFIX`, `AWS_REGION`.

### Kod

- [x] `apps/api/src/media/` — stub + S3, `POST /api/admin/catalog/decorations/:id/image`.
- [x] Lokalnie: stub zapisuje do `.local-media/`, serwuje `GET /api/media/decorations/:filename`.
- [x] Web: cropper 4:3 → WebP → upload w `admin-decoration-form`.
- [x] Testy + build API/web.

### Poza zakresem (v1)

- Kasowanie obiektu S3 przy delete dekoracji (nice-to-have).
- CloudFront, galeria wielu zdjęć (v2).

**Commits:** `0134ed0`, `a1859d7` (cropper + local stub fix).
