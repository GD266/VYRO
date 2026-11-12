# Development Conventions

These conventions keep the codebase predictable as the analysis engine is added. They are enforced by TypeScript, ESLint, tests, and review.

## 1. Language and TypeScript

- Strict mode is mandatory. Do not weaken `tsconfig.json`.
- `any` is forbidden by ESLint. Use `unknown` and narrow explicitly.
- Prefer `readonly` fields and arrays for contracts.
- Use `type` imports (`@typescript-eslint/consistent-type-imports`).
- Avoid non-null assertions. Handle absence explicitly.
- Use discriminated unions for state that can fail.
- Return `null` for undefined numeric results rather than `NaN`.
- Export public contracts from the module's `index.ts`.

### `noUncheckedIndexedAccess`

Array and record access may be `undefined`. Handle it:

```ts
const first = samples[0];
if (first === undefined) {
  return null;
}
```

Do not add `!` to silence the compiler.

## 2. Imports

- Use the `@/*` alias for `src/*`.
- Keep import groups ordered: external packages, blank line, internal modules, blank line, relative files.
- Import from a module's public `index.ts` when one exists.
- Do not reach into another feature's private files.

```ts
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, Screen, Text } from '@/components/ui';
import { ROUTES } from '@/constants';
import { theme } from '@/theme';
```

## 3. Files and naming

| Kind | Convention | Example |
| --- | --- | --- |
| React component | PascalCase `.tsx` | `ScreenHeader.tsx` |
| Screen | PascalCase + `Screen` | `ConsentScreen.tsx` |
| Hook | `use` + camelCase | `useReducedMotion.ts` |
| Store | lowercase noun | `preferences.ts` |
| Utility | lowercase noun | `validation.ts` |
| Test | `*.test.ts(x)` under `__tests__` | `quality.test.ts` |
| Route | lowercase path segment | `scan/preparation.tsx` |

One primary export per component file. Avoid default exports outside route files.

## 4. Screens and routes

- Route files in `src/app` are thin: import a feature screen and export it as default.
- Screens live in `src/features/<domain>/screens`.
- Shared UI lives in `src/components/ui`.
- Feature-specific components can live in `src/features/<domain>/components`.
- Do not put business logic in route files.
- Use `ROUTES` constants for navigation paths.
- Use `router.push` for stack screens and `router.navigate` for tab destinations.
- Route params must be validated before use.

## 5. Styling

- Use the theme tokens in `src/theme`. Do not hard-code spacing, radii, or font sizes.
- Use `StyleSheet.create` for static styles.
- Inline style arrays are fine for computed values (safe-area padding, progress width).
- Raw colors are limited to translucent variants that cannot be represented by a token. Keep them close to the component and consistent with the palette.
- No NativeWind or runtime CSS. The design system is token-driven.
- Respect `layout.maxContentWidth` and `layout.screenPadding` through `Screen`.
- Use `Screen` for safe areas and sticky footers. Do not reinvent them.
- Keep radii restrained and shadows subtle. The interface should feel quiet, not glossy.

## 6. Components

- Components accept `readonly` props.
- Provide `accessibilityLabel` for icon-only actions.
- Use `Pressable` with a pressed state for interactive surfaces.
- Maintain a minimum 44×44 touch target.
- Use `Text` with a variant and tone rather than raw `fontSize`/`color` unless the value is genuinely unique.
- Keep copy out of generic components; pass it in.
- Avoid components that fetch data. Screens orchestrate; components render.

## 7. State and data

- Use Zustand for local, persisted UI state.
- Do not put derived server data in the preferences store.
- Analysis sessions and reports will need a separate store with an explicit retention policy.
- Persist only what is necessary.
- Version persisted schemas and migrate deliberately.
- Never store images, landmarks, names, emails, or tokens in AsyncStorage without a documented reason.
- No screen may require a network call to render.

## 8. Errors

- Throw `AppError` or a subclass for expected failures.
- Use `ConfigurationError` for missing configuration.
- Normalize unknown errors with `normalizeError`.
- Show `error.userMessage` to users, not the technical message.
- Never put personal data in `context`.
- Use `ErrorState` for recoverable failures and `Note` for expected limitations.
- Fail closed when quality, consent, or validation is uncertain.

## 9. Privacy rules in code

- No camera or photo permission until the capture phase.
- No image upload without an explicit, documented feature and consent.
- No identity recognition, face matching, or embeddings.
- No attractiveness scoring or ranking.
- No genetic, medical, age, ethnicity, or health inference.
- AI requests contain derived measurements only.
- Provider keys never enter `EXPO_PUBLIC_*`.
- Logs must not contain facial data or personal identifiers.
- Deletion must remove everything the feature created.

## 10. Testing

- Use Jest with `jest-expo`.
- Use React Native Testing Library for components.
- RNTL 14 is async: **await `render` and `fireEvent`**.

```tsx
const onPress = jest.fn();
await render(<Button label="Continue" onPress={onPress} />);
await fireEvent.press(screen.getByRole('button', { name: 'Continue' }));
expect(onPress).toHaveBeenCalledTimes(1);
```

- Test behavior, not implementation details.
- Test failure paths: missing data, invalid input, rejected quality, prohibited claims.
- Keep fixtures explicit and minimal.
- Do not snapshot large screens.
- Mock native modules in `jest.setup.ts`.

### What must be tested

- Quality-gate thresholds and session completeness.
- Geometry degenerate cases.
- Consent validity and version changes.
- AI schema, provenance, confidence/evidence, and prohibited claims.
- Shared component interaction and disabled/loading states.
- Any new measurement or retention behavior.

## 11. Accessibility

- Every interactive element needs a role, label, and state.
- Checkboxes use `accessibilityRole="checkbox"` and `accessibilityState`.
- Progress uses `accessibilityRole="progressbar"` and `accessibilityValue`.
- Decorative icons are not announced.
- Text must remain readable at large system sizes. Avoid fixed-height text containers.
- Motion must respect reduced motion.
- Do not rely on color alone to convey state.
- Test with VoiceOver and TalkBack before release.

## 12. Performance

- Keep the root layout light; it gates the whole app.
- Avoid unnecessary re-renders from broad Zustand selectors. Select the smallest field.
- Use native-driver animations.
- Do not block the JS thread during capture or analysis.
- Measure cold start, capture latency, memory, and thermal behavior on real devices.
- Lazy-load heavy native modules when they are added.

## 13. Environment and secrets

- Only `EXPO_PUBLIC_*` variables are available in the app.
- Treat every public variable as visible to an attacker.
- Server keys belong in server-side configuration.
- Keep `.env.example` current and value-free.
- Never commit `.env`, `.env.local`, keystores, or credentials.
- Use EAS secrets for build-time secrets.

## 14. Dependencies

- Prefer Expo-maintained modules.
- Install native packages with `npx expo install`.
- Check the SDK-compatible version before adding a package.
- Avoid packages that duplicate an existing Expo module.
- Review licenses and native permissions.
- Do not run `npm audit fix --force`.
- Commit the lockfile.

## 15. Git and review

- Keep changes scoped to one concern.
- Write imperative commit subjects: `add quality gate tests`, not `added stuff`.
- Do not commit generated `dist/`, `.expo/`, or native folders.
- A pull request should state what changed, why, and what was verified.
- Privacy, retention, measurement, or claim changes require explicit review.

## 16. Definition of done

A task is done when:

- `npx tsc --noEmit` passes.
- `npx expo lint` passes.
- `npm test` passes.
- New behavior has tests.
- Empty, loading, error, and disabled states are handled where relevant.
- Accessibility labels and touch targets are present.
- No secrets or personal data are logged or committed.
- Documentation is updated for architectural, privacy, or claim changes.
- Android and iOS exports still succeed for changes that affect bundling.
