---
title: "Account Fit Score"
pitch: "A model that scores every company in your market on how likely it is to become a real opportunity — so the team works the few hundred that matter, not the tens of thousands that don't."
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

## Why score the TAM at all

We had tens of thousands of accounts in the addressable market and a sales team that can only really work a few hundred of them at a time. So the question was never "is this a good account?". It was "out of everything out there, which few hundred do we spend our hours on this quarter?"

The old answer was a point-based fit score built on crude firmographics — headcount, revenue, industry. The problem was that it barely predicted anything. Its correlation to closed-won was about 0.03, basically noise, and its "best" tier converted at roughly the same rate as a random account. So reps burned hours on accounts that looked fine on a spreadsheet and never closed, while genuinely good-fit ones sat untouched because nothing surfaced them.

That's expensive for every GTM team, not just sales:

- **SDRs and AEs** work a prioritised list that's no better than working the alphabet
- **Marketing** spends budget and nurture on segments that don't convert
- **RevOps** can't route leads, draw territories or set SLAs on a signal that isn't real
- **Partnerships and AMs** have no shared, defensible definition of "who's worth a play"

Prioritising the TAM well is the one decision that quietly sets the ceiling on everything downstream. That's the whole reason this exists.

## What I built

I replaced the gut-feel score with one that actually learns from what closed — an end-to-end model that predicts each account's probability of turning into a qualified opportunity, trained on historical CRM outcomes.

Two decisions shaped it. First, I spent most of the effort on the features rather than the algorithm: industry, data warehouse, cloud provider, and roughly 40 individual technologies collapsed into technographic groups, plus prior opportunity history and product-usage signals. That's where the real signal lived. Second, I deliberately chose an interpretable model — plain logistic regression — so I could translate the coefficients into "this trait raises fit / this one lowers it" typologies in plain English. On a GTM team, a score nobody can explain is a score nobody trusts, and a score nobody trusts doesn't get used.

Then I scored the entire addressable market — tens of thousands of accounts — bucketed everything from Very Low to Very High, and generated a human-readable trait summary for every single account so a rep could see *why* it landed where it did. I built the Superset dashboard people actually explore it in, and I validated the whole thing against the legacy score and against real outcomes before asking anyone to rely on it.

## How it works

The pipeline starts from historical CRM data — accounts, opportunities, SQL outcomes, and the firmographic and technographic attributes attached to them. That gets assembled into a single modelling table in Snowflake, then run through feature engineering to encode, scale and group the raw attributes into the signal typologies the model consumes.

From there a logistic regression trains on a stratified split with cross-validated tuning, optimising for F1 rather than raw accuracy since the classes are heavily imbalanced (most accounts never convert, so accuracy alone would just reward predicting "no"). The trained model then scores every account in the market: a 0-100% number, a bucket, and a generated trait summary. Scores and buckets write back into the warehouse and onto CRM fields so they drop straight into the prioritisation workflows the team already runs, and the same data feeds the self-serve dashboard.

## Impact

The top decile of scored accounts converted to opportunities at roughly 10x the rate of the legacy model's top tier. The top fit bucket alone hit a 45-50% SQL rate and around a 30% opportunity rate, while the mid-tiers dropped to low single digits and the bottom buckets fell under 0.3% — which is what finally gave the team the confidence to deliberately *ignore* a large chunk of the market instead of pretending to work all of it.

The legacy score offered almost no signal (~0.03 correlation to outcomes). This one produced a clean, monotonic conversion gradient from bottom bucket to top — the kind of thing sales, marketing and RevOps could all point at and agree on.
