# Facial Analysis Research Notes

This document describes the scientific posture of VYRO. It is not a validation report, a clinical protocol, or evidence that any measurement is meaningful. It defines what the product is allowed to claim and what must be proven before claims are made.

## 1. Scope

VYRO measures geometric relationships between facial landmarks. The research question is narrow:

> Given a controlled 2D capture, can we compute stable, reproducible facial measurements and describe their limitations honestly?

It is **not**:

- Can we determine whether a face is attractive?
- Can we infer health, genetics, ancestry, age, or identity?
- Can we rank people against a population?
- Can we replace a clinical assessment?

Those are different questions with different evidence requirements. VYRO does not answer them.

## 2. Four layers, never collapsed

| Layer | Example | What it is | What it is not |
| --- | --- | --- | --- |
| Capture | Image frame, angle, timestamp | Raw input and session metadata | A measurement |
| Landmarks | Normalized points, pose, confidence | Model output | Meaning |
| Measurements | Ratio, distance, angle | Arithmetic over landmarks | A judgment |
| Observation / explanation | "The ratio is 0.87" | Interpretation tied to measurements | Evidence |

An observation without measurement provenance is an opinion. An AI explanation is never a measurement. A score is never a scientific result.

## 3. Measurement primitives

VYRO uses normalized image coordinates and prefers scale-independent ratios.

- **Distance**: Euclidean distance between two normalized points.
- **Ratio**: numerator divided by denominator, with explicit handling of zero and non-finite values.
- **Angle**: angle at a vertex in degrees, range 0–180.
- **Midpoint**: average of two points.
- **Symmetry deviation**: absolute difference in distance from a facial midline, normalized by the larger distance. This is a geometric deviation, not a symmetry score.
- **Mean and percent difference**: aggregate and comparative helpers.

All primitives return `null` or an explicit failure for degenerate input. `NaN` must never reach a report.

## 4. Candidate measurement catalog

The current catalog is exploratory. Every entry has `status: 'candidate'`, `evidenceLevel: 'exploratory'`, and `referenceRange: null`.

| ID | Description | Unit | Key limitation |
| --- | --- | --- | --- |
| `interocular-distance-ratio` | Eye-center distance / face width | ratio | Pose and landmark placement |
| `intercanthal-distance-ratio` | Inner-eye-corner distance / face width | ratio | Eye shape and detection error |
| `face-width-to-height-ratio` | Bizygomatic width / facial height | ratio | Perspective and camera distance |
| `jaw-width-ratio` | Jaw width / face width | ratio | Hair and shadow occlusion |
| `mouth-width-ratio` | Mouth-corner distance / face width | ratio | Expression and lip posture |
| `nasal-width-ratio` | Nose width / face width | ratio | Lighting and nostril boundaries |
| `eye-aspect-ratio` | Eye opening height / eye width | ratio | Blinking and gaze |
| `midface-height-ratio` | Eye line to mouth line / facial height | ratio | Inconsistent reference points across poses |
| `symmetry-deviation-index` | Mean paired-landmark deviation from midline | normalized | Pose and lens distortion create apparent asymmetry |

### Why no reference ranges

A reference range is a claim about a population. It requires:

- A defined population and sampling method.
- Consistent landmark definitions and capture protocol.
- Measurement error estimates.
- Age, sex, and ancestry considerations where relevant.
- A defensible source and version.

None of that exists for VYRO yet. Presenting an invented "ideal" range would be scientific misconduct dressed as design.

## 5. Quality gate

The quality gate is the first line of defense. Its defaults are engineering thresholds, not validated constants.

| Signal | Default | Rationale |
| --- | --- | --- |
| Brightness | 0.25–0.90 | Avoid crushed shadows and clipped highlights |
| Blur | <= 0.35 | Landmark placement degrades with motion blur |
| Face coverage | 0.15–0.80 | Too small loses detail; too large crops landmarks |
| Center offset | <= 0.25 | Reduce perspective and cropping bias |
| Pose deviation | <= 12° | Limit out-of-plane rotation for the requested angle |
| Occlusion | <= 0.15 | Hair, hands, and accessories corrupt landmarks |
| Detection confidence | >= 0.70 | Reject uncertain detections |
| Landmark count | >= 468 | Ensure a complete landmark set |

A session is accepted only when all three angles are present and every sample passes. Missing metrics fail closed. A rejected scan receives actionable guidance, not an analysis.

### Calibration work required

- Per-device camera characterization.
- Repeatability across sessions and operators.
- Sensitivity of each threshold to lighting and skin tone.
- False-accept and false-reject rates.
- A policy for borderline captures.

## 6. Sources of error

### 2D versus 3D

A single 2D image is a projection. Depth, jaw angle, and nasal projection are not directly observed. Profile views add information but do not reconstruct a full 3D surface.

### Lens and perspective

Wide-angle selfie cameras exaggerate central features and distort edges. Camera distance changes apparent proportions. A fixed capture protocol reduces but does not eliminate this.

### Landmark error

Landmark models have systematic and random error. Error varies by pose, occlusion, lighting, expression, age, and skin tone. A measurement inherits landmark error and can amplify it through ratios.

### Expression and posture

Smiling, blinking, lip posture, and head tilt change measurements. A neutral expression instruction is necessary but not sufficient.

### Reference data

Population norms are not universal. A range derived from one group cannot be applied to another without justification. VYRO currently makes no population claims.

### Multiple comparisons

Testing many measurements increases the chance of spurious patterns. Exploratory analysis must be labeled as exploratory and not promoted to a conclusion without pre-registration and replication.

## 7. What cannot be concluded

VYRO will not claim or imply:

- **Attractiveness**: There is no scientific basis for a universal attractiveness score. Preference varies by culture, individual, and context.
- **Genetics or ancestry**: Facial geometry does not establish genetic ancestry or predisposition.
- **Health or medical status**: Measurements are not diagnostic. VYRO is not a medical device.
- **Identity**: Geometric measurements are not identity verification.
- **Age**: Apparent age estimation is unreliable and ethically fraught.
- **Ethnicity or race**: Social categories are not reliably inferable from geometry.
- **Character or personality**: Physiognomy is pseudoscience.
- **Ideal proportions**: "Golden ratio" claims are culturally constructed and empirically weak as judgments of individuals.

## 8. Validation program

Before any measurement is presented as more than exploratory, VYRO should complete:

1. **Protocol definition** — capture distance, lighting, expression, angle tolerance, device handling.
2. **Device matrix** — representative iOS and Android devices, front and rear cameras, resolutions.
3. **Repeatability study** — same subject, same device, repeated sessions; intraclass correlation and Bland–Altman analysis.
4. **Inter-operator study** — different people guiding capture.
5. **Ground-truth comparison** — where feasible, compare against manual annotation or a validated anthropometric method.
6. **Population diversity** — recruit beyond convenience samples; report limitations by group without making unsupported comparisons.
7. **Measurement error model** — propagate landmark uncertainty into each measurement.
8. **Pre-registration** — define hypotheses and analyses before looking at outcomes.
9. **Peer review** — external review of methods and claims.
10. **Versioned results** — measurement definitions and thresholds must be versioned so old reports remain interpretable.

### Open research questions

- Which measurements are stable enough across devices to compare longitudinally?
- How much does camera distance change each ratio?
- What pose tolerance is required for profile measurements?
- How should confidence be calibrated and displayed?
- When is a difference larger than measurement error?
- Which reference sources, if any, are appropriate for a diverse user base?

## 9. AI explanation constraints

An AI explanation may:

- Restate a measurement and its unit.
- Describe geometric relationships.
- Cite limitations and uncertainty.
- Suggest low-risk, optional grooming or styling considerations when justified.

An AI explanation may not:

- Score, rank, or rate a person.
- Infer identity, health, genetics, ethnicity, or age.
- Diagnose or recommend medical, surgical, or invasive procedures.
- Invent measurements or cite unknown IDs.
- Present exploratory evidence with high confidence.
- Claim certainty that the data does not support.

The app validates structure and prohibited claims before display. Validation is necessary but not sufficient; provider behavior must be red-teamed and monitored.

## 10. References and standards to review

These are starting points, not endorsements or validated sources for VYRO:

- Farkas, L. G. *Anthropometry of the Head and Face*. Raven Press, 1994.
- Naini, F. B. *Facial Aesthetics: Concepts and Clinical Diagnosis*. Wiley-Blackwell, 2011.
- ISO/IEC 29794-1, *Biometric sample quality — Part 1: Framework*.
- MediaPipe Face Landmarker documentation, Google.
- Expo camera and development-build documentation, Expo.

Any reference used in the product must be reviewed for edition, population, methodology, and applicability. A citation is not a license to overclaim.

## 11. Change control

Any change to the following requires a documented review:

- Measurement definitions or semantic landmark mappings.
- Quality thresholds.
- Evidence levels or reference ranges.
- Consent copy or retention behavior.
- AI prompt, schema, or validation rules.
- Any user-facing claim about what a measurement means.

The default stance is conservative: if the evidence is insufficient, show less.
