# ADR 0001: Foundation decisions

- **Status:** Accepted
- **Date:** 2026-11-12
- **Scope:** Foundation build

## Context

VYRO needed a production-minded Expo/React Native foundation before any facial analysis engine existed. The main risks were architectural drift, accidental overclaiming, privacy debt, and a demo full of fabricated scores. The foundation had to be launchable without credentials, type-safe, testable, and ready for a real on-device pipeline.

## Decisions

### 1. Expo Router with `src/app`

**Decision:** Use Expo Router file-based routing under `src/app`, with typed routes enabled.

**Rationale:** Deep links, tabs, stack transitions, and route groups are first-class. Keeping routes thin and screens in `src/features` separates navigation from presentation.

**Consequences:** Route paths must stay unique. Typed routes require generated types during development. Non-route code must never live in `src/app`.

### 2. Custom theme tokens + StyleSheet

**Decision:** Build a centralized token system and use React Native `StyleSheet`, not NativeWind.

**Rationale:** The interface is component-heavy and the design is deliberately restrained. Tokens provide consistency without adding a runtime styling layer or build configuration.

**Consequences:** More manual component styling. New components must use tokens and avoid hard-coded values.

### 3. Zustand + AsyncStorage for local state

**Decision:** Persist onboarding, consent, and haptics with Zustand and AsyncStorage.

**Rationale:** The foundation needs local, synchronous-feeling state that works offline and without accounts. Zustand is small and testable.

**Consequences:** Analysis sessions and reports must not be mixed into this store. A separate retention-aware store is required later.

### 4. Consent as a versioned local record

**Decision:** Store consent version, timestamp, and adult confirmation locally. Invalidate consent when the version changes.

**Rationale:** Explicit consent is a product requirement. A versioned record supports re-consent without a backend.

**Consequences:** Policy changes require a new consent version and a re-consent path. Deletion must clear the record.

### 5. Interface-only vision and analysis layers

**Decision:** Define capture, landmark, quality, measurement, and report contracts without implementing the engine. Do not add camera permissions or native vision dependencies yet.

**Rationale:** The scientific boundary must be designed before model output exists. Shipping placeholder scores would undermine trust and create rework.

**Consequences:** The app has clearly labeled placeholders. The capture phase must implement `LandmarkDetector` and metric computation behind the existing contracts.

### 6. Fail-closed quality gate

**Decision:** A session is accepted only when all three angles are present and every sample passes. Missing metrics block analysis.

**Rationale:** Confident output from bad input is worse than no output.

**Consequences:** More rejected captures. Thresholds need device calibration before being treated as guarantees.

### 7. Exploratory-only measurement catalog

**Decision:** Every catalog entry is `candidate`, `exploratory`, with `referenceRange: null`.

**Rationale:** The arithmetic can be defined without claiming meaning. Reference ranges require population-specific validation.

**Consequences:** No attractiveness or "ideal proportion" claims. Validation work is a prerequisite for stronger evidence levels.

### 8. Provider-independent AI via backend proxy

**Decision:** The app calls a backend AI proxy. It never holds provider keys. AI output is validated before display.

**Rationale:** Key safety, vendor flexibility, rate limiting, logging policy, and schema translation belong on the server. Validation protects against unsupported claims.

**Consequences:** AI cannot ship without a backend. The proxy must enforce authentication, limits, and retention policy.

### 9. Optional, lazy Supabase

**Decision:** Supabase is optional and lazily initialized. The app must work without it.

**Rationale:** Accounts and cloud sync are not part of the foundation. Requiring credentials would block local development and contradict the local-first posture.

**Consequences:** No screen depends on Supabase. Cloud features need a privacy review, RLS, and deletion design.

### 10. No fabricated data

**Decision:** Placeholder screens explicitly state that analysis is unavailable. No mock scores, sample insights, or synthetic charts are shown.

**Rationale:** Fabricated data trains users to trust output that does not exist and creates ethical and product debt.

**Consequences:** The app looks intentionally empty in analysis areas. That is the honest state.

### 11. TypeScript 6 path mapping without `baseUrl`

**Decision:** Use `paths` relative to `tsconfig.json` and remove `baseUrl`, which TypeScript 6 deprecates.

**Rationale:** Keeps strict typechecking clean on the installed toolchain.

**Consequences:** Path mappings resolve relative to the config file. Do not reintroduce `baseUrl` without an explicit migration.

### 12. React Native Testing Library 14 async API

**Decision:** Await `render` and `fireEvent` in tests.

**Rationale:** RNTL 14 uses the modern `test-renderer` and exposes an async API.

**Consequences:** Synchronous test patterns from older RNTL versions will fail.

## Alternatives considered

- **NativeWind:** Rejected for build complexity and because tokens + StyleSheet are sufficient.
- **Redux Toolkit:** Rejected as heavier than needed for local preferences.
- **Required Supabase from day one:** Rejected because the foundation must run without credentials.
- **Camera and MediaPipe in the foundation:** Rejected to avoid permissions, native builds, and fake analysis before the quality model was defined.
- **Mock analysis data:** Rejected on ethical and product grounds.

## Consequences and follow-up work

- Implement capture and quality metrics before any analysis UI is populated.
- Calibrate quality thresholds per device.
- Validate measurements before raising evidence levels.
- Build the AI proxy before enabling explanations.
- Add retention-aware session storage.
- Complete legal, ethics, accessibility, and security review before release.
