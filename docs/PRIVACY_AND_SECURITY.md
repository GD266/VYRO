# Privacy and Security

VYRO treats a face as sensitive personal data. This document describes the current build, the intended processing boundary, and the controls that must exist before capture, analysis, or AI features ship.

## 1. Principles

1. **Minimize.** Collect and retain less than the feature needs.
2. **Process locally.** Prefer on-device capture and landmark detection.
3. **Consent explicitly.** No processing before a clear, versioned agreement.
4. **Delete completely.** Local deletion is immediate and resets consent.
5. **Do not identify.** No face matching, identity verification, or recognition.
6. **Do not rank.** No public attractiveness scores, leaderboards, or percentiles.
7. **Do not infer.** No genetics, health, ethnicity, age, or character claims.
8. **Fail closed.** If quality or consent is uncertain, do not analyze.
9. **Keep secrets server-side.** The app contains no provider keys.
10. **Be legible.** Privacy copy is plain language, not legal fog.

## 2. Data inventory (current build)

| Data | Where | Persisted | Purpose | Contains facial data |
| --- | --- | --- | --- | --- |
| Consent version | AsyncStorage | Yes | Prove which agreement was accepted | No |
| Consent timestamp | AsyncStorage | Yes | Show acceptance date and validate freshness | No |
| Adult confirmation | AsyncStorage | Yes | Enforce 18+ scope | No |
| Onboarding completion | AsyncStorage | Yes | Route returning users correctly | No |
| Haptics preference | AsyncStorage | Yes | Respect user preference | No |
| Images | Nowhere | No | Not collected in this build | — |
| Landmarks | Nowhere | No | Not generated in this build | — |
| Measurements | Nowhere | No | Not generated in this build | — |
| Account or email | Nowhere | No | No account system exists | No |
| Analytics or crash data | Nowhere | No | Not configured | No |

The current build makes no network requests from any screen. Optional Supabase and AI clients exist but are not initialized unless configured and called.

## 3. Consent lifecycle

1. The welcome screen explains the product and links to privacy principles.
2. Consent requires two independent affirmations:
   - the user is 18 or older,
   - the user consents to on-device facial image processing for measurement when capture becomes available.
3. The agreement version is stored with the timestamp. A version change invalidates older consent and routes the user back through consent.
4. The user can withdraw by deleting local data in Profile. This removes the consent record, onboarding state, and preferences.
5. No processing occurs without current consent. The tab navigator and index route enforce this.
6. The consent screen states that no camera permission is requested in this build.

### Open consent work

- Re-consent flow for material policy changes.
- Separate consent for optional cloud sync.
- Separate consent for saving images, if that feature is ever added.
- Plain-language translations.
- Accessibility review of consent copy.

## 4. Processing boundary

### Current build

```
Device only
  └─ AsyncStorage: consent + preferences
```

No image capture, no upload, no cloud profile.

### Intended capture phase

```
Camera
  └─ On-device frame
      ├─ Quality gate
      └─ On-device landmark detection
          └─ Derived measurements
              ├─ Local report
              └─ Optional AI explanation request (derived data only)
```

Images and raw landmarks are intended to remain on-device. They must not be included in AI requests, analytics events, crash reports, or logs.

### AI proxy boundary

When AI explanations ship:

- The mobile app sends only derived measurements, quality metadata, report limitations, and a schema version.
- The backend proxy owns provider credentials and provider-specific translation.
- The proxy enforces authentication, rate limits, request size limits, and timeouts.
- Provider logging and retention must be documented and minimized.
- The app validates the response and blocks unsupported claims before display.
- A kill switch disables explanations without breaking the rest of the app.

## 5. Retention and deletion

### Current

- Preferences and consent persist until the user deletes local data or uninstalls the app.
- Deletion is available in Profile → Delete local data.
- Deletion clears the Zustand store and AsyncStorage entry, then returns to welcome.
- No server-side data exists to delete.

### Future

- Captured frames should be ephemeral by default and deleted at the end of the session.
- Saving a session must be explicit, reversible, and explained before it happens.
- Session deletion must remove frames, landmarks, measurements, and reports together.
- Cloud sync, if added, must support account deletion and verified removal.
- Retention periods must be documented per data type.

## 6. Security controls

### Secrets

- Only `EXPO_PUBLIC_*` values are available to the bundle.
- Those values are public and are treated as such.
- Provider API keys, Supabase service-role keys, and signing secrets never enter the repository or the app.
- `.env.example` documents names without values.

### Transport

- The HTTP client validates URLs and uses HTTPS in production.
- Timeouts abort hung requests.
- Error messages do not echo response bodies that may contain sensitive data.

### Supabase

- The client is lazy and optional.
- Session persistence uses AsyncStorage.
- Future tables must use row-level security and least-privilege policies.
- Service-role keys must never be used in the app.

### Logging

- `AppError.context` must not contain images, landmarks, names, emails, or identifiers.
- The logger writes technical messages and non-personal context.
- Production logging must be reviewed before crash reporting is enabled.
- AI prompts and responses must not be logged with facial data.

### Dependencies

- `npm audit` currently reports transitive moderate advisories; do not run `npm audit fix --force`.
- Review dependencies before adding native modules.
- Prefer Expo-maintained modules.
- Pin SDK-compatible versions with `npx expo install`.

## 7. Threat model

| Threat | Impact | Mitigation |
| --- | --- | --- |
| Device loss or theft | Local preferences exposed | No images stored; OS device encryption; minimal local data |
| Malicious app on device | Cannot read app sandbox without compromise | Platform sandboxing; no shared storage |
| Network interception | AI request/response exposure | TLS; derived data only; no images |
| Provider retention | Third-party holds facial-derived data | Backend proxy policy, minimization, contractual review |
| Prompt injection | Harmful or unsupported explanation | Structured schema, validation, prohibited-claim checks, human review |
| Re-identification | Face matched to identity | No identity recognition; no public datasets; no face embeddings |
| Overcollection | More data than needed | Data inventory, deletion, retention review |
| Shadow profiles | Data linked without consent | No accounts in current build; explicit consent for any sync |
| Model bias | Unequal quality or error | Diverse validation, quality thresholds, limitations |
| Insider access | Staff sees facial data | No server-side images; least privilege; audit logs without payloads |
| Dependency compromise | Supply-chain attack | Review, lockfile, audit, minimal dependencies |

## 8. User rights

The current build supports:

- Knowing what is stored (this document and the in-app privacy screen).
- Withdrawing consent by deleting local data.
- Using the app without an account.
- Avoiding camera permission entirely.

Future support must include:

- Access and export of stored reports.
- Correction of inaccurate data.
- Deletion of cloud data.
- A privacy contact and response timeline.
- A record of consent changes.

## 9. Incident response

Before public release, define:

1. A security contact and private disclosure channel.
2. Severity levels and response timelines.
3. Containment playbooks for credential exposure, proxy compromise, and data loss.
4. User notification criteria and templates.
5. A post-incident review process.
6. A kill switch for AI explanations and cloud sync.

## 10. Open items before launch

- Legal review of consent copy and privacy claims.
- Data protection impact assessment for facial data.
- Provider and subprocessor review.
- Backend authentication and rate-limit design.
- RLS policies and cross-account tests, if cloud sync is added.
- Retention schedule and deletion verification.
- Accessibility review of privacy controls.
- Published privacy contact.
- Store privacy declarations and data safety form.
- Independent security review.

## 11. Reporting a concern

A private security contact will be published before any public release. Until then, do not submit facial images or personal data to VYRO.
