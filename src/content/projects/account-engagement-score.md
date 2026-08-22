---
title: "Account Engagement Score"
pitch: "A behavioural propensity model that scores the entire prospect universe on how actively each account is engaging right now."
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

## The problem

Fit alone tells you whether an account is a good match — it doesn't tell you whether it's ready *now*. Every week, thousands of accounts across the prospect universe throw off thousands of behavioural signals: meetings, page views, marketing emails, event attendance, developer and community activity. Almost all of it is noise, and there was no data-driven way to know which signal types actually predicted anything, or how to weight them against each other.

## What I built

I built the Account Engagement Score: an L1-regularised logistic regression that learns from historical opportunity outcomes which behavioural touch types actually predict opportunity creation, and calibrates that into a single 0-100% score. Underneath it sits a feature pipeline that reduces roughly 30 candidate signal types down to a clean per-account feature matrix, binarised so that one high-frequency touch type can't drown out everything else.

Getting the model right took about nine iterations and a three-stage layered approach: a diagnostic run to understand the raw signal, a positive-only fit to isolate what genuinely predicts conversion, and a hybrid "manual floor" version where every prospect touch nudges the score up (never down) while the fitted signals still dominate the ranking. I added a recent-touch gate so accounts that have gone silent score zero, then percentile-banded the output into Very High/High/Medium/Low so it reads as a ranked, explainable priority list rather than a black-box number. I also built a parallel Contact Engagement Score at the individual-contact grain, paired engagement against fit in a 2x2 targeting-vs-timing framework, and generated per-account score-driver explanations in both JSON and human-readable form.

## How it works

Behavioural data flows in from conversation intelligence, first-party product and web events, marketing automation, chat, events, community activity, and CRM opportunity history, and gets unified into a warehouse modelling layer. From there, feature engineering aggregates each account's distinct touch timestamps by type, pivots them into an account-by-feature matrix, and binarises over a rolling lookback window so frequency doesn't distort the signal.

That feature matrix trains the L1 logistic regression, which is class-weighted and validated with stratified cross-validation. The output coefficients, the recent-touch gate, and percentile banding combine to produce a calibrated score with attached driver explanations, which is then written back for activation: priority outbound lists, nurture segments, routing and SLA inputs, and BI dashboards.

## Impact

The top engagement band converts to opportunities at roughly 190x the rate of accounts with no engagement at all. The model concentrates effort on a very small, high-value slice of the universe — about 2% of accounts flagged as genuinely active, with the top two bands converting at a combined ~26%. Feature selection cut the candidate signal set from around 30 touch types down to roughly 20 that actually carry predictive weight, and the model holds a strong ROC-AUC of ~0.95 in cross-validation (precision is intentionally low by design — this is a prioritisation ranking, not a hard classifier).
