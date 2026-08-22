---
title: "Account Fit Score"
pitch: "An ML model that grades every company in the market on how likely it is to become a real opportunity."
order: 1
featured: true
tech: ["Python", "scikit-learn", "pandas", "Snowflake", "dbt", "Superset"]
repo: null
metrics:
  - { value: "~10x", label: "top-decile opportunity rate vs legacy" }
  - { value: "~45-50%", label: "SQL rate in top bucket" }
  - { value: "~0.03→strong", label: "correlation to real outcomes" }
diagram:
  nodes:
    - { id: "crm", label: "CRM source data", tech: "Salesforce", group: "source", detail: "Historical account, opportunity and SQL outcomes plus firmographic and technographic attributes." }
    - { id: "warehouse", label: "Warehouse feature assembly", tech: "Snowflake · SQL", detail: "Joins account traits and outcomes into a single modeling table." }
    - { id: "features", label: "Feature engineering", tech: "Python · pandas", detail: "Encodes and scales inputs, consolidating industries, warehouses, clouds and roughly 40 technologies into grouped signal typologies." }
    - { id: "train", label: "Model training & tuning", tech: "scikit-learn", detail: "Logistic regression on a stratified train/test split, tuned with 5-fold cross-validation and a grid search over regularization strength and class weights, optimizing for F1." }
    - { id: "score", label: "Market-wide scoring", tech: "Python", detail: "Applies the model to every account to produce a 0-100% fit score, Very Low to Very High buckets, and a plain-English trait summary." }
    - { id: "writeback", label: "GTM write-back", tech: "CRM fields", detail: "Pushes scores and buckets back into warehouse tables and CRM fields so GTM workflows can prioritize on them." }
    - { id: "bi", label: "BI dashboard", tech: "Superset", group: "sink", detail: "Self-serve dashboard for stakeholders to explore scores, buckets and drivers." }
  edges:
    - { from: "crm", to: "warehouse" }
    - { from: "warehouse", to: "features" }
    - { from: "features", to: "train" }
    - { from: "train", to: "score" }
    - { from: "score", to: "writeback" }
    - { from: "writeback", to: "bi" }
---

## The problem

The legacy account scoring model was a point-based system built on crude firmographics, and it barely correlated with what actually closed. Its correlation to real closed-won outcomes was close to zero (~0.03), and even its "best" tier of accounts only marginally outperformed the average account. Reps were spending real time working accounts that looked fine on paper but had almost no chance of ever becoming a deal, while genuinely promising accounts went untouched simply because nothing was surfacing them.

## What I built

I built an end-to-end account-scoring model that predicts the probability of an account becoming a qualified opportunity, trained on historical CRM outcomes. That meant engineering and grouping the predictive features that actually mattered — industry, data warehouse, cloud provider, roughly 40 individual technologies collapsed into technographic groups, prior opportunity history, and product usage signals — and choosing an interpretable model (logistic regression) so the coefficients could be translated into plain-English "this raises/lowers fit" signal typologies that non-technical stakeholders could trust.

Once the model was validated, I scored the entire addressable market — tens of thousands of accounts — bucketed them from Very Low to Very High fit, and generated a human-readable trait summary for every single one. I also built the stakeholder-facing BI dashboard used to explore the results, and ran the validation work against the legacy score and against real account outcomes before anyone was asked to trust it.

## How it works

The pipeline starts from historical CRM data — accounts, opportunities, SQL outcomes, and the firmographic/technographic attributes tied to them. That gets assembled into a modeling table in the warehouse, then run through feature engineering to encode, scale and group the raw attributes into the signal typologies the model actually consumes. From there, a logistic regression is trained on a stratified split with cross-validated hyperparameter tuning, optimizing for F1 rather than raw accuracy since the classes are imbalanced.

The trained model is then applied market-wide: every account in the addressable market gets a 0-100% score, a bucket, and a generated trait summary explaining why it landed where it did. Scores and buckets are written back into the warehouse and onto CRM fields so they slot directly into existing GTM prioritization workflows, and the same data feeds a self-serve BI dashboard for anyone who wants to explore it further.

## Impact

The top decile of scored accounts converted to opportunities at roughly 10x the rate of the legacy model's top tier. The top fit bucket alone saw a 45-50% SQL rate and around a 30% opportunity rate, while mid-tiers dropped to low single digits and the bottom buckets fell under 0.3% — giving the GTM team the confidence to deliberately deprioritize a large share of the total market. Where the legacy score offered almost no signal (~0.03 correlation to outcomes), the new score produced a clear, monotonic conversion gradient from bottom to top bucket.
