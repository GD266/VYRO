# VYRO Architecture

## 1. Context

VYRO is a mobile-first facial measurement research tool. The foundation build exists to make the hard product decisions explicit **before** any capture or analysis code is written:

- What is a capture, a landmark, a measurement, and an interpretation?
- Which inputs are allowed to produce output?
- Where does data live?
- What must the app never claim?

The architecture is organized around those questions. The result is a working navigation and design system with deliberately empty analysis surfaces, not a demo filled with plausible-looking numbers.

### Goals

- Android and iOS from one Expo/React Native codebase.
- Strict TypeScript with no `any` in application code.
- Local-first operation with no required credentials.
- A design system that feels premium, quiet, and consistent.
- Typed boundaries for vision, analysis, and AI.
- A codebase that can add the real engine without restructuring screens.

### Non-goals for this build

- Implementing camera capture or landmark detection.
- Producing measurements, observations, scores, or insights.
- Integrating a paid AI provider.
- Accounts, cloud sync, social features, or leaderboards.
- Medical, genetic, or identity-related claims.

---

## 2. System overview

```
┌────────────────────────────────────────────────────────────────────┐
│ src/app                                                             │
│ Expo Router routes, guards, splash, error boundary                  │
└──────────────────────────────┬─────────────────────────────────────┘
                               │ renders
┌──────────────────────────────▼─────────────────────────────────────┐
│ src/features/*/screens                                              │
│ Presentation, local UI state, copy, empty/error states              │
└───────┬──────────────────────┬──────────────────────┬──────────────┘
        │                      │                      │
┌───────▼────────┐   ┌─────────▼─────────┐   ┌────────▼────────────┐
│ components/ui  │   │ hooks + store     │   │ constants + theme   │
│ design system  │   │ local preferences │   │ tokens + copy       │
└────────────────┘   └───────────────────┘   └─────────────────────┘

Domain boundaries (no UI dependency):

┌────────────────┐   ┌──────────────────┐   ┌─────────────────────┐
│ src/vision     │   │ src/analysis     │   │ src/ai              │
│ capture,       │──▶│ geometry,        │──▶│ prompt, validation, │
│ landmarks,     │   │ measurements,    │   │ provider boundary   │
│ quality gate   │   │ reports          │   │                     │
└────────────────┘   └──────────────────┘   └─────────────────────┘

Support:

┌────────────────┐   ┌──────────────────┐   ┌─────────────────────┐
│ src/services   │   │ src/lib          │   │ src/utils + types   │
│ HTTP client    │   │ optional Supabase│   │ errors, logging     │
└────────────────┘   └──────────────────┘   └─────────────────────┘
```

### Dependency direction

1. `types`, `constants`, `theme`, and `utils` have no feature dependencies.
2. `vision` depends on shared types only.
3. `analysis` depends on shared types and the vision quality result.
4. `ai` depends on analysis contracts and the HTTP service.
5. Features depend on domain contracts and UI components.
6. Routes depend on feature screens only.

The analysis layer never imports a concrete landmark model. The AI layer never imports a provider SDK. This keeps model choice and vendor choice reversible.

---

## 3. Routing and navigation

Expo Router uses file-based routing under `src/app`. Every file in that directory is a route or a layout; all other code lives outside it.

### Route groups

| Path | Purpose |
| --- | --- |
| `src/app/_layout.tsx` | Root stack, splash control, status bar, error boundary |
| `src/app/index.tsx` | Consent-aware redirect |
| `src/app/welcome.tsx` | Product introduction |
| `src/app/consent.tsx` | Adult confirmation and processing consent |
| `src/app/(tabs)/_layout.tsx` | Consent-guarded tab navigator |
| `src/app/(tabs)/home.tsx` | Dashboard |
| `src/app/(tabs)/scan.tsx` | Capture introduction |
| `src/app/(tabs)/insights.tsx` | Insight model |
| `src/app/(tabs)/profile.tsx` | Settings and deletion |
| `src/app/scan/preparation.tsx` | Checklist |
| `src/app/scan/capture.tsx` | Capture placeholder |
| `src/app/analysis.tsx` | Pipeline boundary |
| `src/app/recommendations.tsx` | Guarded guidance |
| `src/app/progress.tsx` | Longitudinal model |
| `src/app/privacy.tsx` | Privacy principles |
| `src/app/+not-found.tsx` | Fallback |

### Guards and hydration

- `usePreferencesStore` persists onboarding, consent, and haptics to AsyncStorage.
- The root layout waits for `hydrated` before rendering the stack, so a returning user does not flash the welcome screen.
- The splash screen is hidden only after hydration completes.
- `/` redirects to `/welcome` when consent is absent or stale, and to `/home` when it is current.
- The tab layout repeats the guard as defense in depth for deep links.
- Consent version changes invalidate older consent records automatically.

### Why routes are thin

Route files contain only a default export of a feature screen. This keeps routing concerns separate from presentation, makes screens testable without the router, and avoids duplicating logic across tabs and stack entry points.

### Error handling at the route level

The root layout exports an Expo Router `ErrorBoundary`. It logs a non-personal error message, shows a calm recovery screen, and exposes a retry action. It never displays stack traces or user data.

---

## 4. State management

There is one persisted store: `src/store/preferences.ts`.

| Field | Persisted | Purpose |
| --- | --- | --- |
| `hydrated` | No | Prevents UI before AsyncStorage is read |
| `hasCompletedOnboarding` | Yes | Onboarding completion |
| `consent` | Yes | Version, acceptance timestamp, adult confirmation |
| `hapticsEnabled` | Yes | Local preference |

The store uses Zustand `persist` with AsyncStorage and a schema version. Rehydration failure is logged without personal data and still marks the store hydrated, so the app never hangs on a corrupt preference file.

There is intentionally no analysis store yet. Measurement sessions and reports will require a separate, explicit retention policy; they should not be mixed into preferences.

---

## 5. Design system

### Tokens

`src/theme` centralizes:

- `colors`: charcoal surfaces, platinum accent, semantic tones.
- `gradients`: hero, elevated, accent, fade-to-background.
- `spacing`: 4px-based scale.
- `radii`: restrained 4–24px plus pill.
- `layout`: screen gutter, max content width, tab/header heights, touch target.
- `typography`: system font stack, size/line-height/letter-spacing scales, named variants.
- `shadows`: two elevation levels.

Components consume tokens. Raw colors are limited to translucent accent and semantic variants that cannot be expressed by a single token.

### Component layer

`src/components/ui` contains:

- Primitives: `Text`, `Button`, `IconButton`, `Card`, `Badge`, `Divider`, `ProgressBar`.
- Structure: `Screen`, `ScreenHeader`, `SectionHeader`, `ListItem`, `StepItem`.
- Feedback: `EmptyState`, `ErrorState`, `LoadingState`, `Note`.
- Brand and motion: `BrandMark`, `FadeIn`.

`Screen` owns safe areas, tablet max-width, scroll behavior, and sticky footers. `ScreenHeader` owns the back affordance and title hierarchy. This prevents each screen from reinventing spacing and safe-area handling.

### Styling choice

The project uses `StyleSheet` rather than NativeWind. The design is token-driven and component-heavy; a runtime styling layer would add build complexity without improving maintainability here. The tokens are the single source of truth.

### Motion and accessibility

- `FadeIn` uses native-driver opacity and translate, and becomes a no-op when the OS requests reduced motion.
- Buttons and icon buttons expose roles, labels, disabled/busy state, and 44px touch targets.
- Checkboxes use `accessibilityRole="checkbox"` and `accessibilityState`.
- Progress uses `accessibilityRole="progressbar"` and `accessibilityValue`.
- Body text targets readable contrast on charcoal surfaces.

---

## 6. Vision layer

`src/vision` defines the boundary between a future native capture engine and the analysis layer.

### Contracts

- `ImageFrame`: URI, dimensions, rotation, capture time.
- `CaptureSample`: one angle plus its frame.
- `CaptureSession`: consent version and samples.
- `FaceLandmarkSet`: model identity, version, normalized points.
- `FaceDetectionResult`: landmarks, bounding box, head pose, confidence.
- `LandmarkDetector`: the replaceable interface a concrete model implements.

No implementation of `LandmarkDetector` exists. MediaPipe Face Landmarker is a likely candidate, but the analysis layer must not depend on it.

### Quality gate

`src/vision/quality.ts` evaluates normalized metrics:

| Signal | Direction | Default threshold |
| --- | --- | --- |
| Brightness | 0..1, higher is brighter | 0.25–0.90 |
| Blur | 0..1, higher is worse | <= 0.35 |
| Face coverage | 0..1 | 0.15–0.80 |
| Face center offset | 0..1 | <= 0.25 |
| Pose deviation | degrees | <= 12 |
| Occlusion | 0..1, higher is worse | <= 0.15 |
| Detection confidence | 0..1 | >= 0.70 |
| Landmark count | count | >= 468 |

The thresholds are engineering defaults, not validated scientific constants. They must be calibrated per device before being presented as product guarantees.

`assessCaptureSession` requires all three angles and every sample to pass. Missing metrics produce a blocking `metrics_unavailable` issue. The gate **fails closed**: no output is better than confident output from bad input.

---

## 7. Analysis layer

`src/analysis` separates:

1. **Measurement definitions** — what could be computed, its unit, evidence level, required semantic landmarks, and limitations.
2. **Measurement results** — a value with a unit, confidence, sample, angle, and timestamp.
3. **Observations** — statements that must cite measurement IDs.
4. **Analysis reports** — schema version, consent version, quality assessment, measurements, observations, and limitations.

### Geometry

`src/analysis/geometry.ts` provides distance, midpoint, angle, ratio, symmetry deviation, mean, and percent difference. Each function handles degenerate input explicitly (zero length, zero denominator, empty list) instead of returning `NaN`.

### Candidate catalog

`src/analysis/measurements.ts` contains nine candidate ratios and indices. Every entry is:

- `evidenceLevel: 'exploratory'`
- `status: 'candidate'`
- `referenceRange: null`

The catalog defines arithmetic, not meaning. It cannot be used to score a person.

### Report contract

`AnalysisReport` is the only object the AI layer may consume. It contains derived measurements and quality metadata, never images or raw landmarks. `AnalysisPipeline` is an interface; `AnalysisNotAvailableError` is the explicit failure for this build.

---

## 8. AI layer

The AI boundary is provider-independent and backend-proxy-only.

```
Mobile app → ApiClient → backend AI proxy → provider
```

- `src/ai/providers/remote.ts` posts the structured prompt to a configured proxy URL.
- The app holds no provider key. `EXPO_PUBLIC_AI_PROXY_URL` is a URL, not a secret.
- The proxy owns provider credentials, model selection, rate limits, logging policy, and schema translation.
- `createAIProvider()` returns `null` when no proxy is configured. There is no fake fallback.

### Prompt constraints

`buildExplanationPrompt` refuses to run unless the report passed quality and contains measurements. The system prompt forbids identity, health, genetic, ethnicity, age, attractiveness, scoring, ranking, and medical claims. It requires measurement citations and explicit limitations.

### Validation

`validateAIExplanation` performs structural checks:

- Schema version, required strings, length limits.
- At least one observation and at least one limitation.
- Every observation and recommendation cites known measurement IDs.
- Evidence levels and confidence levels are valid.
- Exploratory evidence cannot carry high confidence.
- A prohibited-claim blocklist catches attractiveness, scoring, diagnosis, genetics, identity, ethnicity, age, guarantees, and absolutes.

The blocklist is defense in depth, not proof of soundness. Human review and structural provenance remain primary.

---

## 9. Services, Supabase, and configuration

### HTTP client

`src/services/api/client.ts` provides a typed `post` with:

- URL validation at construction.
- Abort-based timeout.
- JSON parsing with explicit errors.
- Normalized `AppError` instances and user-safe messages.

No screen currently calls the network.

### Supabase

`src/lib/supabase.ts` lazily creates a client only when both public values exist. Otherwise it throws `ConfigurationError`. Session persistence uses AsyncStorage and refresh is tied to app state. The app must remain usable without Supabase; no screen requires it.

### Environment

`src/constants/env.ts` reads only `EXPO_PUBLIC_*` values. These are inlined into the bundle and are public. Server keys belong in server-side environment variables, never in this repository.

---

## 10. Error model

`src/utils/errors.ts` defines:

- `AppErrorCode`: configuration, network, validation, permission, storage, vision, analysis, AI, unknown.
- `AppError`: technical message, user message, optional original error, optional context.
- `ConfigurationError`: a specific missing-configuration error.
- `normalizeError` and `getUserMessage`.

Rules:

- User-facing messages are calm and actionable.
- Error context must never contain images, landmarks, names, emails, or other personal data.
- Screens use `ErrorState` for recoverable failures and `Note` for expected limitations.
- Unknown errors are logged without payloads.

---

## 11. Future data flow

When the engine exists, the intended flow is:

```
Camera
  → ImageFrame (ephemeral)
  → Quality gate
      ├─ reject → actionable issue list, no analysis
      └─ accept
          → LandmarkDetector (on-device)
          → semantic landmark mapping
          → Measurement definitions
          → MeasurementResult[]
          → AnalysisReport
          → optional AI explanation (derived data only)
          → UI with evidence, confidence, and limitations
```

Retention decisions are not implicit. Each step must declare whether it is ephemeral, session-scoped, or explicitly saved.

---

## 12. Extension points

### Add a landmark model

1. Implement `LandmarkDetector` in `src/vision` or a dedicated adapter package.
2. Map model indices to the semantic landmark names used by the measurement catalog.
3. Add device performance and quality tests.
4. Do not import the adapter from `src/analysis`; inject it at the pipeline boundary.

### Add a measurement

1. Add a `MeasurementDefinition` with semantic landmarks, unit, evidence level, status, and limitations.
2. Keep `referenceRange: null` until a defensible population-specific source exists.
3. Add geometry tests, including degenerate inputs.
4. Add the measurement to the report and AI validation fixtures.

### Add an AI provider

1. Implement the backend proxy, not a mobile SDK.
2. Keep provider credentials server-side.
3. Translate provider output to the `AIExplanation` schema.
4. Run the existing validation and add provider-specific red-team tests.

### Add cloud sync

1. Define the retention and deletion model first.
2. Add authentication and row-level security.
3. Encrypt sensitive fields and document the data residency.
4. Make cloud sync opt-in and keep local-only mode fully functional.

---

## 13. Key tradeoffs

| Decision | Benefit | Cost |
| --- | --- | --- |
| Custom theme + StyleSheet | No extra build layer, full control | More manual component work |
| Zustand + AsyncStorage | Simple, local, testable | Not suitable for large analysis history |
| Thin routes, feature screens | Clear boundaries, testable | Slight indirection |
| Interface-only vision/analysis | Prevents fake results | No end-to-end demo yet |
| Backend AI proxy | No keys in the app, provider-neutral | Requires a server before AI ships |
| Fail-closed quality gate | Protects scientific integrity | More rejected captures |
| Exploratory-only catalog | Honest about evidence | Less impressive-looking output |

These tradeoffs are intentional. See [ADR 0001](adr/0001-foundation-decisions.md) for the decision record.
