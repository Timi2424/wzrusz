# @wzrusz/ui

Shared Angular UI primitives for the Wzrusz monorepo.

## Import

```typescript
import { WzCheckbox } from '@wzrusz/ui';
```

Path alias: `@wzrusz/ui` → `libs/ui/src/index.ts` (see `tsconfig.base.json`).

## Components

| Selector | Purpose |
|----------|---------|
| `wz-checkbox` | Brand-styled checkbox with `ControlValueAccessor` for Reactive Forms |
| `wz-datetime-picker` | PrimeNG calendar + time; blocks past dates by default (`minDate`) |

Design tokens (`--wzrusz-accent`, `--wzrusz-ink`, …) are defined in `apps/web/src/styles.scss` and fall back inside the library.

## Build

```bash
nx run ui:build
nx run ui:test
nx run ui:lint
```

`web` depends on `ui` via Nx `^build` — production builds compile the library first.
