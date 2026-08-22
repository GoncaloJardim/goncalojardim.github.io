---
title: "Account Fit Score"
pitch: "An ML model that grades every company in the market on how likely it is to become a real opportunity."
order: 1
featured: true
tech: ["Python", "scikit-learn", "Snowflake", "dbt", "Superset"]
repo: null
metrics:
  - { value: "~10x", label: "top-decile opportunity rate vs legacy" }
diagram:
  nodes:
    - { id: "crm", label: "CRM source data", tech: "Salesforce", group: "source", detail: "Historical account, opportunity and SQL outcomes plus firmographic and technographic attributes." }
    - { id: "score", label: "Market-wide scoring", tech: "Python", group: "sink", detail: "Applies the model to every account to produce a 0-100% fit score and Very Low to Very High buckets." }
  edges:
    - { from: "crm", to: "score" }
---

Placeholder body — expanded in Task 7.
