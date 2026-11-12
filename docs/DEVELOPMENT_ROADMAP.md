# VYRO Development Roadmap

This roadmap starts from the foundation build and moves toward a trustworthy measurement product. Each phase has an explicit exit criterion. A phase is not complete because screens exist; it is complete when the data path, failure behavior, privacy posture, and tests are in place.

## Current status

| Area | Status |
| --- | --- |
| Navigation shell | Complete |
| Design system | Complete |
| Consent and local deletion | Complete |
| Vision and quality contracts | Complete |
| Measurement catalog (exploratory) | Complete |
| AI contracts and validation | Complete |
| Camera capture | Not started |
| Landmark detection | Not started |
| Measurement engine | Not started |
| Analysis reports and insights | Not started |
| AI provider and backend proxy | Not started |
| Longitudinal progress | Not started |
| Accounts and cloud sync | Not planned until privacy review |

---

## Phase 0 — Foundation (complete)

Delivered:

- Expo SDK 58 / React Native 0.88 / TypeScript 6 foundation.
- Expo Router navigation with consent guards, splash hydration, and a root error boundary.
- Dark premium design system with safe areas, tablet max-width, reduced motion, and accessible primitives.
- Welcome, consent, home, scan introduction, preparation, capture placeholder, analysis, recommendations, progress, insights, profile, and privacy screens.
- Zustand + AsyncStorage preferences with versioned consent.
- Vision quality gate with fail-closed session assessment.
- Analysis geometry and exploratory measurement catalog.
- AI explanation schema, prompt, provider boundary, and structural validation.
- Optional Supabase and AI configuration; no required secrets.
- Jest/RNTL tests for quality, geometry, consent, AI validation, and shared UI.
- Brand assets, EAS profiles, environment template, and documentation.

Exit criterion met: `tsc`, lint, tests, Expo config, and Android/iOS exports succeed without credentials.

---

## Phase 1 — Capture and quality metrics

### Scope

- Add `expo-camera` or `react-native-vision-camera` through `npx expo install`.
- Configure camera permission text in `app.json`; create a development build.
- Implement a guided capture screen with a face oval, angle prompts, and a stable shutter.
- Capture three frames: front, left profile, right profile.
- Keep frames in memory or app cache; never upload them.
- Compute the quality metrics required by `src/vision/types.ts`:
  - brightness histogram or mean luminance,
  - blur via variance of Laplacian or an equivalent on-device metric,
  - face coverage and center offset from the detector bounding box,
  - pose deviation from the requested angle,
  - occlusion signal,
  - detection confidence and landmark count.
- Connect `assessSampleQuality` and `assessCaptureSession` to real data.
- Add explicit retake, cancel, and delete-session actions.
- Add tests for metric computation where deterministic fixtures are possible.

### Exit criteria

- A real device can capture three angles and receive an accept/reject decision.
- Rejected frames show actionable guidance, not a generic error.
- No image leaves the device.
- Session deletion removes cached files.
- Quality thresholds are documented as engineering defaults and have a device calibration plan.

### Risks

- Camera behavior differs across Android vendors.
- Blur and occlusion metrics are sensitive to lighting and hair.
- A development build becomes mandatory once native modules are added.

---

## Phase 2 — On-device landmark detection

### Scope

- Evaluate MediaPipe Face Landmarker and platform alternatives.
- Package the model with a compatible license and document its version.
- Implement `LandmarkDetector` as an adapter, not inside `src/analysis`.
- Map model indices to semantic names such as `left-eye-inner`, `face-left`, and `chin-bottom`.
- Measure latency, memory, and thermal behavior on low-, mid-, and high-end devices.
- Reject frames with insufficient landmarks or low detection confidence.
- Store landmark output only for the active session; do not persist by default.

### Exit criteria

- All three accepted frames produce a complete semantic landmark set.
- Detector identity and model version are recorded with the result.
- The analysis layer has no import of the concrete model.
- Device performance is within an agreed budget for the capture flow.
- Tests cover mapping, missing landmarks, and model failure.

### Risks

- Model licensing and redistribution terms.
- Landmark instability at profile angles.
- Native build complexity and app size.
- Accessibility and skin-tone bias in detection quality.

---

## Phase 3 — Measurement engine

### Scope

- Implement each catalog definition against semantic landmarks.
- Add per-measurement confidence derived from landmark visibility, pose, and detection quality.
- Handle degenerate geometry explicitly; never emit `NaN`.
- Add unit tests with synthetic landmarks and real accepted captures.
- Build a reproducibility study: same subject, same device, repeated sessions.
- Build a device matrix study: camera, lens, resolution, and distance.
- Investigate population-appropriate reference sources. Keep `referenceRange: null` until a defensible source exists.
- Add a versioned measurement schema and migration policy.

### Exit criteria

- Every exploratory measurement is computed with traceable inputs.
- Repeatability and device sensitivity are quantified and documented.
- No measurement is presented as an attractiveness judgment.
- Confidence is calibrated, not decorative.
- The report contains limitations for every measurement.

### Risks

- 2D landmarks cannot capture true 3D geometry.
- Lens distortion and camera distance change apparent proportions.
- Reference ranges are easy to misuse and hard to validate.
- Small measurement errors can be amplified by ratios.

---

## Phase 4 — Reports, observations, and insights UI

### Scope

- Assemble `AnalysisReport` from quality, measurements, and limitations.
- Implement observation rules that cite measurement IDs and evidence levels.
- Replace analysis placeholders with real report views.
- Show measurement value, unit, confidence, angle, and limitations together.
- Add empty, partial, rejected, and failed states.
- Add local session history with explicit retention controls.
- Add export only if the privacy model supports it.

### Exit criteria

- A report cannot exist without an accepted quality assessment.
- Every observation cites at least one measurement.
- Users can delete a report and its session data.
- The UI never displays a score, rank, or ideal-face comparison.
- Report schema and migrations are tested.

---

## Phase 5 — AI explanations

### Scope

- Build a backend proxy that owns provider credentials.
- Send only derived measurements and quality metadata; never images or landmarks.
- Enforce authentication, rate limits, request size limits, and timeouts.
- Keep provider logs free of facial data and personal identifiers.
- Use the existing prompt and validation schema.
- Add red-team cases for medical, genetic, identity, attractiveness, age, ethnicity, and scoring claims.
- Add a kill switch and a deterministic fallback to "no explanation available."
- Document the model, provider, retention, and subprocessors.

### Exit criteria

- No provider key exists in the mobile bundle.
- Invalid or unsupported output is blocked before display.
- Explanations always cite measurements and limitations.
- A provider outage degrades to a clear empty state.
- Security review covers prompt injection and data exfiltration.

### Risks

- Prompt injection through measurement labels or report text.
- Provider retention policies.
- Hallucinated causal language.
- Cost and latency.

---

## Phase 6 — Longitudinal progress

### Scope

- Define what makes two sessions comparable: angle, quality, device, and measurement version.
- Store accepted sessions locally with explicit consent.
- Compute deltas only for like-for-like measurements.
- Show confidence and data gaps.
- Add deletion by session and by measurement history.
- Prevent rankings, percentiles, and population comparisons.

### Exit criteria

- No comparison is shown when quality or angle is not comparable.
- Users can inspect why a delta is or is not available.
- History deletion is complete and verifiable.
- Progress is framed as personal change, not improvement or attractiveness.

---

## Phase 7 — Optional accounts and cloud sync

This phase is blocked until the privacy and security review is complete.

### Scope

- Choose an authentication model and document it.
- Enable Supabase Auth with row-level security.
- Encrypt sensitive fields and define key management.
- Define data residency, retention, export, and deletion.
- Make sync opt-in; local-only mode remains fully functional.
- Add account deletion that removes cloud and local data.
- Add audit logging without facial data.

### Exit criteria

- A privacy impact assessment is signed off.
- RLS is tested against cross-account access.
- Deletion is verified end to end.
- No facial image is stored in the cloud unless a separately justified feature requires it.

---

## Phase 8 — Release readiness

### Scope

- Legal and ethics review of claims, consent copy, and recommendations.
- Accessibility audit with VoiceOver and TalkBack.
- Device matrix QA, including small screens and large text.
- Crash reporting and analytics with a no-PII policy.
- Store listing, screenshots, privacy nutrition labels, and data safety form.
- Incident response and contact channels.
- Penetration test of the backend proxy and any cloud sync.
- Versioned consent migration and re-consent flow.

### Exit criteria

- Claims are reviewed and supported.
- Accessibility and performance budgets pass.
- Store privacy declarations match actual behavior.
- A privacy contact and deletion process are live.
- Rollback and kill-switch procedures are documented.

---

## Cross-cutting workstreams

| Workstream | Ongoing requirement |
| --- | --- |
| Privacy | Data minimization, deletion, no shadow profiles, no identity recognition |
| Scientific integrity | Quality gate, evidence levels, limitations, reproducibility |
| Security | No secrets in the app, TLS, RLS, dependency review, threat modeling |
| Accessibility | Roles, labels, focus order, touch targets, reduced motion, large text |
| Performance | Cold start, capture latency, memory, thermal behavior |
| Documentation | Architecture decisions, schema changes, retention changes |

## Explicit non-goals

VYRO will not ship:

- Attractiveness scores, rankings, or public leaderboards.
- Genetic, ancestry, ethnicity, age, or health inference.
- Medical diagnosis or treatment recommendations.
- Identity recognition or face matching.
- Sale, rental, or trading of facial data.
- Hidden collection or background capture.
- Synthetic analysis results presented as real.

## Recommended next step

Start Phase 1 with a narrow spike: capture one frame on iOS and Android, compute brightness and blur, and run it through the existing quality gate. Do not build the full capture UI until the metric pipeline is proven on real devices. The quality gate is the product's first line of scientific defense; it should be validated before anything is measured.
