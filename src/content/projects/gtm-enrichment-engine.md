---
title: "GTM Enrichment Engine"
pitch: "An automated, multi-provider enrichment engine that turns a handful of high-fit accounts into a continuously refreshed warehouse of look-alike companies and validated, outreach-ready contacts."
order: 3
featured: true
tech: ["n8n", "Snowflake", "dbt", "Python", "Apollo.io", "ZoomInfo", "LLM APIs"]
repo: null
metrics:
  - { value: "~5x", label: "data warehouse expansion" }
  - { value: "~97%", label: "email accuracy" }
  - { value: "~40-50%", label: "sales research time reclaimed" }
diagram:
  nodes:
    - { id: "prioritize", label: "Account Prioritization", tech: "ML · Snowflake", group: "source", detail: "Scores existing accounts and selects high-fit ones as seeds for expansion." }
    - { id: "prospect", label: "Look-alike Prospecting", tech: "LLM APIs · ocean.io", detail: "Finds net-new look-alike companies from the seed accounts using LLM search APIs, look-alike matching and purchased/scraped sources." }
    - { id: "waterfall", label: "Enrichment Waterfall", tech: "fan-out", type: "fanout", detail: "Fans each prospect out across parallel enrichment providers to maximize contact coverage and quality." }
    - { id: "apollo", label: "Apollo.io", tech: "mass scale", detail: "Mass-scale contact and firmographic enrichment." }
    - { id: "zoominfo", label: "ZoomInfo", tech: "mass scale", detail: "Mass-scale contact and firmographic enrichment, used to cross-cover Apollo gaps." }
    - { id: "fullenrich", label: "FullEnrich", tech: "phone · quality", detail: "Higher-quality enrichment including phone numbers where mass-scale providers fall short." }
    - { id: "reversecontact", label: "ReverseContact", tech: "reverse lookup", detail: "Resolves personal-to-business email and reverse-looks-up event leads." }
    - { id: "validate", label: "Email Validation", tech: "NeverBounce", type: "branch", detail: "Validates every enriched email at scale and branches records into valid, catch-all-for-reverification, or invalid-for-suppression." }
    - { id: "warehouse", label: "Warehouse of Truth", tech: "Snowflake · dbt", detail: "Deduplicated, validated, refresh-scheduled account and contact records, refreshed on a 4-6 month cadence." }
    - { id: "activate", label: "Activation", tech: "CRM · outbound", group: "sink", detail: "Feeds outbound, events, partnerships and demand-gen with reliable, ready-to-use records." }
  edges:
    - { from: "prioritize", to: "prospect" }
    - { from: "prospect", to: "waterfall" }
    - { from: "waterfall", to: "apollo" }
    - { from: "waterfall", to: "zoominfo" }
    - { from: "waterfall", to: "fullenrich" }
    - { from: "waterfall", to: "reversecontact" }
    - { from: "apollo", to: "validate" }
    - { from: "zoominfo", to: "validate" }
    - { from: "fullenrich", to: "validate" }
    - { from: "reversecontact", to: "validate" }
    - { from: "validate", to: "warehouse" }
    - { from: "warehouse", to: "activate" }
---

## The problem

The account and contact database was thin and going stale, and enrichment was a manual, tool-by-tool slog spread across disconnected systems — which meant data silos and inconsistent quality on top of the wasted effort. Reps were losing roughly half their time to manual research instead of selling, and outbound volume was capped by how fast a person could build a one-off list by hand.

## What I built

I designed and owned the end-to-end enrichment architecture end to end: prioritization, prospecting, enrichment, validation, and activation, orchestrated in n8n. The pipeline chains an ML fit-score model, LLM-based look-alike prospecting, and — the centerpiece — a fan-out enrichment waterfall that hits multiple contact-data providers in parallel rather than relying on any single vendor's coverage.

I modeled and normalized the enriched data in Snowflake via dbt, with dedup logic and a 4-6 month refresh cadence so the warehouse doesn't quietly go stale again. I also built a multi-provider contact-enrichment waterfall paired with an email-validation stage that routes every record into valid, catch-all, or invalid buckets, and defined the success metrics and reporting used to coordinate the effort across Data, Marketing and RevOps.

## How it works

It starts with account prioritization: existing accounts are scored, and high-fit ones become seeds. Those seeds feed a look-alike prospecting step that uses LLM search APIs and look-alike matching to surface net-new companies that resemble the best existing accounts. From there, the real showpiece: an enrichment waterfall that fans each prospect out to four providers in parallel — Apollo.io and ZoomInfo for mass-scale coverage, FullEnrich for phone numbers and higher-quality matches, and ReverseContact for personal-to-business email resolution and event-lead lookups.

Every enriched contact then passes through email validation, which branches results into valid, catch-all (queued for re-verification), or invalid (suppressed outright). Everything that survives lands in the "warehouse of truth" — deduplicated, validated, and refreshed on a 4-6 month cycle in Snowflake via dbt — which in turn feeds activation: outbound campaigns, events, partnerships and demand-gen reporting.

## Impact

The warehouse expanded roughly 5x, growing from tens of thousands of records to the low hundreds of thousands. Email accuracy landed around 97%, with bounce rates near 3%. The multi-provider waterfall and automation reclaimed an estimated 40-50% of the sales time previously lost to manual research, and a single production run of the pipeline produced around 1,800 freshly enriched contacts — decoupling list-building capacity from manual effort entirely.
