# Plan: media storage enabler (F-03)

Roadmap: **F-03** `media-storage-enabler` — S3 upload zdjęć dekoracji, stub lokalnie.

## Scope

1. **API** — moduł `media/` (`MEDIA_MODE=stub|s3`), upload przez API (`multipart`), endpoint `POST /api/admin/catalog/decorations/:id/image`.
2. **Web** — admin formularz dekoracji: `<input type="file">` + podgląd zamiast ręcznego URL.
3. **Env** — `.env.example` z `S3_MEDIA_*`; AWS bucket/IAM poza kodem (checklist w `change.md`).

## Out of scope

- CloudFront, resize/WebP, galeria wielu zdjęć.
- Kasowanie obiektu S3 przy delete dekoracji.

## Verify

- `nx test api web`
- `nx build api web`
- Lokalnie: upload JPG w edycji dekoracji → stub log + placeholder `/brand/logo-avatar.png` w katalogu.

## Progress

### Phase 1: API media module
- [x] `media.config`, `stub-media.storage`, `s3-media.storage`, `MediaModule`
- [x] `AdminCatalogService.uploadDecorationImage` + controller endpoint
- [x] Testy config + upload

### Phase 2: Web admin upload
- [x] `AdminCatalogApiService.uploadDecorationImage`
- [x] Formularz: file input, preview, upload po wyborze pliku (tylko edycja)

### Phase 3: Verify
- [x] `.env.example`, build + test
