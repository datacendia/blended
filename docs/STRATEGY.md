# RootAtlas — strategy, stress-tested

Status: prototype. Facts marked *(unverified)* were not checked during the build.

## The thesis in one line

Patients prepay for manual-therapy packages with no independent way to tell
whether the care is working. RootAtlas is a patient-owned outcome record: it
measures what trials measure, flags when to ask questions, and shows what each
point of improvement cost.

## Why "an app for the whole body, for any issue" is the wrong pitch

"Any issue" is not a market. It is a content treadmill against Visible Body,
Kenhub and YouTube, with no reason to come back on day 8. The anatomy
explorer is the **hook**. The repeat use and the defensible part is the
**tracker plus the report check**: a weekly reason to return, and data
nobody else holds. Start narrow: neck-arm and back-leg nerve pain in people
already paying for care.

## What exists (as far as one search showed)

| Player | What it is | Gap RootAtlas fills |
|---|---|---|
| Physitrack / PhysiApp | Clinician-assigned exercises and outcome measures | Only exists if your clinician uses it; the clinician owns the data |
| Hinge Health, Sword Health, Kaia *(unverified details)* | Employer- or insurer-funded digital MSK programmes, mainly US/EU | Replace care rather than audit it; not available to a self-paying patient in Lima |
| PostureScreen | Clinician posture-photo tool | Produces the numbers; doesn't tell the patient how reliable they are |
| Visible Body, Complete Anatomy | Anatomy education | No tracking, no evidence grades, no "is it working" |

No direct equivalent surfaced: patient-side, clinician-independent, with
MCID verdicts, cost per point and a report self-consistency check. One search
is not proof. Do a proper competitor sweep before calling it "first".

## The hard problems

1. **Distribution is adversarial.** Clinics are the obvious channel, and this
   app can tell a patient their prepaid package isn't working. Low-evidence
   clinics will never hand it out. **Bet:** the good clinics will, as proof.
   Phase 2 is an "outcome-verified clinic" listing: clinics opt in to share
   aggregate MCID rates. Honesty is the product, and it doubles as the sales pitch.
2. **Privacy-first means no telemetry.** There is no analytics today, so none
   of the metrics below can be measured yet. Next step: opt-in, aggregate-only
   counting (no identifiers, no health values leave the device unless the
   person donates an anonymised outcome).
3. **Clinical liability.** The content was written from cited sources but has
   **not** been reviewed by a licensed clinician. That review (physio or
   physiatrist, ideally one in Peru and one abroad) is a launch blocker, not
   a nice-to-have.
4. **Regulation.** Keep it education plus self-tracking. Never "you have X".
   The moment it diagnoses, it risks becoming medical-device software (DIGEMID
   in Peru, FDA/MDR elsewhere). Local-first storage keeps v1 clear of most
   obligations under Peru's personal-data law (Ley 29733) *(get a local legal read)*.
5. **Causation.** Most radiculopathy improves with time. The tracker measures
   change, not credit, and must keep saying so, or it becomes the thing it criticises.

## Metrics (once opt-in counting exists)

| Metric | Definition | 90-day target |
|---|---|---|
| Activation | New visitors who save a baseline check-in on day 1 | ≥ 30% of tracker visitors |
| Measured episodes (north star) | Baseline + ≥ 1 follow-up ≥ 7 days apart | 500 |
| Retention | Episodes with ≥ 3 check-ins over ≥ 14 days | ≥ 25% of activated |
| Checkpoint action | Episodes hitting the trial checkpoint that print or export a summary | ≥ 30% |
| Report decodes | Reports entered (not the sample) | 200 |

## Kill and pivot criteria

After 8 weeks of distribution in Lima (3 clinics, physio groups, social): if
there are fewer than 200 baselines **or** fewer than 20% reach a follow-up, the
patient-side wedge is wrong. Pivot to the clinic-side outcome tool, sold to
evidence-based clinics as proof of results.

## Next 30 / 60 / 90 days

- **30:** clinical review of all content; verify and buy the domain; deploy to
  Netlify; 10 patient interviews (people mid-package) on the tracker.
- **60:** opt-in aggregate counting; low-back/sciatica depth equal to the neck;
  a shareable PDF summary built for clinicians.
- **90:** pilot "outcome-verified" listing with 2-3 Lima clinics; decide on the
  pivot criteria above.
