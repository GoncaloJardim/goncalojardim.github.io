---
title: "Account Engagement Score"
pitch: "The timing layer on top of fit — a behavioural model that scores every account on how actively it's engaging right now, so the team knows not just who to work, but when."
order: 2
featured: true
tech: ["Python", "scikit-learn", "Snowflake", "dbt", "SQL"]
repo: null
metrics:
  - { value: "~190x", label: "conversion lift, top band vs baseline" }
  - { value: "~0.95", label: "ROC-AUC in cross-validation" }
  - { value: "~2%", label: "of universe flagged as active" }
diagram:
  nodes:
    - { id: "signals", label: "Behavioural signals", tech: "events · CRM · marketing", group: "source", detail: "Meetings, page views, marketing engagement, chat, events, community activity and CRM opportunity history across the whole prospect universe." }
    - { id: "model_layer", label: "Warehouse modelling", tech: "Snowflake · dbt", detail: "Unifies the disparate source domain tables into a single modeling layer." }
    - { id: "features", label: "Feature engineering", tech: "dbt · Python", detail: "Aggregates distinct touch timestamps per account and touch type, pivots into an account-by-feature matrix, and binarises over a rolling lookback window to remove frequency-tail noise." }
    - { id: "train", label: "Model training", tech: "Lasso · scikit-learn", detail: "L1-regularised logistic regression, class-weighted and cross-validated, learning which touch types actually predict opportunity creation." }
    - { id: "scoring", label: "Scoring & calibration", tech: "Python · SQL", detail: "Applies model coefficients, a recent-touch gate, and percentile banding to produce a calibrated 0-100% score with explainable drivers." }
    - { id: "activation", label: "Activation", tech: "CRM · BI", group: "sink", detail: "Scored and banded accounts feed priority outbound lists, nurture segments, routing and SLA inputs, and BI reporting." }
  edges:
    - { from: "signals", to: "model_layer" }
    - { from: "model_layer", to: "features" }
    - { from: "features", to: "train" }
    - { from: "train", to: "scoring" }
    - { from: "scoring", to: "activation" }
---

## Fit tells you who. This tells you when.

Fit is a static judgement — it says this account *looks* like the ones that closed. It says nothing about whether they're thinking about you this week. And a perfect-fit account that's gone completely silent is worth less right now than a decent-fit account that just booked a demo, watched three pricing pages and pinged the community.

The catch is that "engagement" is thousands of accounts throwing off thousands of weekly signals — meetings, page views, marketing emails, event attendance, developer and community activity — and almost all of it is noise. Nobody could say which signal types actually predicted anything, or how to weigh a demo against a newsletter open. So the team either chased whoever was loudest or fell back on fit alone.

What makes this genuinely useful is pairing it *with* fit in a 2×2 — targeting on one axis, timing on the other — because each GTM team reads a different quadrant:

- **High fit + high engagement** → SDRs and AEs work these today, they're the whole point
- **High fit + low engagement** → Marketing's job: nurture and create the timing that isn't there yet
- **Low fit + high engagement** → interesting but a trap, RevOps uses it to *avoid* over-routing tyre-kickers
- **Any fit + a sudden engagement spike** → the trigger that should fire a play, an SLA, a routing rule

Fit sets the ceiling on *who*. Engagement decides the *order* you work them in. You need both.

## What I built

The Account Engagement Score is an L1-regularised logistic regression that learns, from historical opportunity outcomes, which behavioural touch types actually predict conversion — and calibrates that into a single 0-100% score. Under it sits a feature pipeline that takes roughly 30 candidate signal types down to a clean per-account matrix, binarised so one high-frequency touch (say, page views) can't drown out a rarer but far more meaningful one (say, a booked meeting).

Getting it right took about nine iterations and, in the end, a three-stage approach:

1. a **diagnostic run** to see what the raw signal even looked like
2. a **positive-only fit** to isolate the touch types that genuinely predict conversion
3. a **hybrid "manual floor"** where every prospect touch only ever nudges the score *up*, never down, while the fitted signals still drive the ranking

That third stage came out of a real tension: the pure model would sometimes penalise an account for a touch that felt intuitively positive, and that's exactly the kind of thing that makes a sales team stop trusting the number. The manual floor keeps the maths honest while making sure the score never does something a rep would find obviously wrong.

I added a recent-touch gate so accounts that have gone quiet score zero rather than coasting on old activity, then percentile-banded the output into Very High / High / Medium / Low so it reads as a ranked priority list, not a black box. I also built a parallel Contact Engagement Score at the individual grain, and generated per-account driver explanations in both JSON and plain English so anyone could see *why* an account was hot.

## How it works

Behavioural data flows in from conversation intelligence, first-party product and web events, marketing automation, chat, events, community activity and CRM opportunity history, and gets unified into a warehouse modelling layer. Feature engineering aggregates each account's distinct touch timestamps by type, pivots them into an account-by-feature matrix, and binarises over a rolling lookback window so raw frequency doesn't distort the picture.

That matrix trains the L1 logistic regression — class-weighted and cross-validated — and the output coefficients, the recent-touch gate and the percentile banding combine into a calibrated score with its drivers attached. From there it writes back for activation: priority outbound lists, nurture segments, routing and SLA inputs, and the BI dashboards each team lives in.

## Impact

The top engagement band converts to opportunities at roughly 190x the rate of accounts with no engagement at all. Just as usefully, it concentrates effort on a tiny slice of the universe — about 2% of accounts flagged as genuinely active — with the top two bands converting at a combined ~26%. Feature selection cut the candidate set from around 30 touch types down to the ~20 that actually carry weight, so the team could finally point at a short, agreed list of "these are the signals that matter".

The model holds a strong ROC-AUC of ~0.95 in cross-validation. Precision is intentionally low — this is a prioritisation ranking, not a hard yes/no classifier, and for deciding what order to work a list in, ranking is the job.
