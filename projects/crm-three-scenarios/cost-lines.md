# Cost lines per scenario — provenance and confidence

Date: 2026-10-01 · Currency USD list prices (portal currency USD; BRIEF line 4) · Layer: PRESENTATION (no scenario is recommended)

Sources allowed for an amount: explore-pricing.json facts (public URL, as-of 2026-10-01) or the tracker's own words. Where neither exists the cell reads **not priced — to be quoted**. Evidence ids follow `implementation-health-check.md` (P-S1-xx / P-S2-xx / P-S3-xx = pricing facts; DT-Tn = tracker rows; LC-Fnn = live probe).

Confidence legend: **official list** (vendor's or HubSpot's own pricing page) · **vendor list** (third-party vendor page) · **partner range** (a partner agency's published "starting at") · **secondary range** (blog / survey quoting partners) · **order of magnitude** (list unit price × a stated assumption) · **illustrative** (public proxy, not measured for this team) · **tracker words** (quoted from AYA_trackerv4_210926.xlsx) · **not priced**.

Record-count basis for every per-record line (live, uncapped, 2026-10-01): 13,679 companies + 26,293 contacts + 1,972 deals = **41,944 CRM records** (LC-F20, LC-F21, LC-F01; sum derived). The team's actual StackSync plan, HubSpot tier and seat count are **not in the repos** (pricing gaps; HR gap).

Reading rule from the brief: S2 = "Same as 1 + an expert CRM partner", so the S2 total is the S1 table **plus** the S2 table. S3 = "Stop technical process and focus on HubSpot-native tools", so S3 lines are what replaces the S1 engine, plus overlap and exit exposure.

---

## S1 · DIY — "None new: your time plus the ongoing cost of the open items"

| Line | New or already incurred | One-off / recurring | Amount or range | Basis | Source | Confidence | Evidence |
|---|---|---|---|---|---|---|---|
| Operator time (all pipelines, scans, hygiene) | already incurred | recurring | **not priced** from the repos; public proxy: USD 1,350–4,500 of staff time per 20–40 h audit run; USD 5,400–18,000 / year if quarterly | staff-time survey | https://portalpilot.io/blog/hubspot-audit-cost (article dated 2026-01-30) | illustrative, not measured | P-S2-04 |
| StackSync subscription (gold writer) | already incurred | recurring | Starter USD 1,000 / month billed annually (USD 1,400 month-to-month): 1 active sync, 50K records · Pro USD 3,000 / month annually (USD 3,700): 3 syncs, 1M records · Managed Pro USD 4,200 / month · overage USD 8 per 1,000 records (50K–150K), USD 2 (150K–1M) · no free tier | active syncs + records in sync; portal basis 41,944 records sits inside the 50K Starter allowance | https://www.stacksync.com/pricing | vendor list; actual plan not in repos | P-S1-01, LC-F01/F20/F21 |
| BigQuery (Bq-dbt, Mir-Load, ic-load) | already incurred | recurring | USD 6.25 / TiB scanned after 1 TiB free per month; active storage USD 0.000031507 / GiB-hour (about USD 0.023 / GiB-month, derived at 730 h); long-term USD 0.000021918 / GiB-hour; first 10 GiB free | bytes scanned + GiB stored; actual volumes not in repos | https://cloud.google.com/bigquery/pricing | official list | P-S1-02 |
| Cloud Run (HS-LOGIC "serverless query layer"; deployment not evidenced in repo) | already incurred per deck; unverified | recurring | USD 0.000024 / vCPU-s active, USD 0.0000025 / GiB-s active, USD 0.40 / million requests; free tier 180,000 vCPU-s, 360,000 GiB-s, 2 million requests / month | request-based billing | https://cloud.google.com/run/pricing | official list | P-S1-03, HS-I9 |
| Compute Engine VM (Mir-Load "GCP instance", Go CDC client) | already incurred | recurring | e2-micro USD 6.11 / month us-central1 (USD 0 for one e2-micro under the Free Tier in us-west1 / us-central1 / us-east1); e2-medium USD 24.46 / month us-central1, USD 32.04 / month europe-west6 (Zurich) | instance size not in repos | https://cloud.google.com/free/docs/free-cloud-features (free tier, official); https://gcloud-compute.com/e2-micro.html and /e2-medium.html (mirror, last update 2026-09-27) | official for free tier; order of magnitude for e2 sizes | P-S1-04 |
| dbt | already incurred | recurring | dbt Core USD 0 (Apache 2.0); dbt platform Developer USD 0 (1 seat, 3,000 models / month), Starter USD 100 per user / month | licence | https://github.com/dbt-labs/dbt-core ; https://www.getdbt.com/pricing | official list | P-S1-05 |
| Oban / "Elixir sync if built" (StackSync → Oban migration, 6 weeks open) | new, only if built | recurring | Open source USD 0; Oban Pro USD 150 / month monthly or USD 135 / month billed yearly (USD 1,620 / year) | licence | https://oban.pro/pricing | vendor list | P-S1-06, DT-I7 |
| Claude API (AI lead triage / ops assistant, hermes "brain") | partly incurred (lead triage live since 7 Sep); volume unknown | recurring | three published model tiers at USD 1 / 2 / 4 per MTok in and USD 5 / 10 / 20 per MTok out; Batch API −50%; cache reads 0.1× input (0.05× top tier). At an assumed 1,000 calls / month × (5,000 in + 1,000 out tokens): about USD 40 / 20 / 10 per month by tier | list unit price × stated assumption; real volume not in repos | https://platform.claude.com/docs/en/about-claude/pricing | official list for units; order of magnitude for monthly | P-S1-07 |
| HubSpot private app token (Hs-Logic, loaders, hs_api.py) | already incurred | recurring | USD 0; up to 20 private apps; rate limit Professional 190 req / 10 s per app and 625,000 / day per account (Enterprise 1,000,000 / day) | no licence line | https://developers.hubspot.com/docs/guides/apps/private-apps/overview | official docs | P-S1-08 |
| hermes-agent VPS (scaffold, 0 / 76 actions done) | new, only if deployed | recurring | **not priced — to be quoted** (guide baseline "Hostinger KVM2" has no price in the admissible sources) | — | HubSpot-Ruler/hermes-agent/docs/VPS-SETUP.md lines 8–11 (baseline only) | not priced | HR-I3, HR-F18 |
| Open items carried as debt (hygiene × 4 for 6 weeks; GitHub backup 17%; CDC observability 0%; data catalog 0%) | already incurred | recurring until closed | **not priced** (operator time; see line 1 proxy) | tracker progress values | AYA_trackerv4_210926.xlsx rows: "[ADMIN] Doc Document workflows and script and update github for code backup … 0.1739 … in progress"; "[INFRA] Add observability & alerting on Hubspot CDC sync failures … 0 … 0" | tracker words | DT-T8, DT-T21, DT-T20, DT-F13 |

S1 summary of what is new: nothing but Oban (if built) and the hermes VPS (if deployed). Everything else is already incurred and recurring; the dominant line is unpriced operator time.

---

## S2 · Partner — "Retainer or per-audit fees; time to hand over knowledge" (added on top of the S1 table)

| Line | New or already incurred | One-off / recurring | Amount or range | Basis | Source | Confidence | Evidence |
|---|---|---|---|---|---|---|---|
| Purchase order for the selected solution | new | — | **PO pending**: tracker "[DOC] Draft PO for partner or Operations Hub — Formalize the purchase order for the selected solution between an external partner and HubSpot Operations Hub … 0 … in progress" (recalculated end 12-Oct-26); benchmark row "[DATA] Partern to Clean CRM companies & groups - assess best solution … 0.5385 … in progress" | tracker rows | AYA_trackerv4_210926.xlsx, sheet "RevOps 6-month plan (2)", lines 10 and 17 | tracker words | DT-T2, DT-T1 |
| Managed-operations retainer | new | recurring | from USD 2,000 / month; 6–12 month minimum; licences separate at partner-discount rates | partner tier (Growth / Build / Strategic) | https://insidea.com/hubspot/managed-operations | partner range | P-S2-01 |
| Fractional admin / retainer menu | new | recurring | Fractional Admin from USD 2,000 / month (10 h); Essential from USD 5,000 / month; Growth from USD 7,500 / month; Enterprise from USD 15,000 / month | scope | https://www.hivestrategy.com/pricing | partner range | P-S2-02 |
| DevOps / RevOps retainer (survey) | new | recurring | USD 2,500–10,000 / month | scope | https://www.impactplus.com/blog/how-much-does-working-with-a-hubspot-partner-agency-cost (article dated 2024-06-09, older) | secondary range | P-S2-05 |
| Independent portal audit (the "Sampling probe: partner audits independently" row) | new | one-off per audit | Standard USD 2,000–5,000; Enterprise USD 5,000–10,000+; one cited partner quote USD 8,200; HIVE audit from USD 3,000; Lean Labs assessment USD 0 | portal size | https://portalpilot.io/blog/hubspot-audit-cost ; https://www.hivestrategy.com/pricing ; https://www.leanlabs.com/pricing.md | secondary range / partner range | P-S2-04, P-S2-02, P-S2-03 |
| Ongoing advisory ("partner reviews changes before they ship") | new | recurring, hourly | USD 150–300 / hour; SmartBug USD 185 / hour | hours | https://portalpilot.io/blog/hubspot-audit-cost ; https://www.getmonetizely.com/articles/how-do-hubspot-implementation-partners-price-their-services-in-2025 | secondary range | P-S2-04, P-S2-06 |
| Handover / training time ("time to hand over knowledge"; tracker "Train former users …" 0%, "Train Miraex and Wecan …" 0%) | new | one-off (per cohort) | Training from USD 200 / hour; guided onboarding 15 h × USD 185 = USD 2,775; onboarding USD 2,000 (Lean Labs) / USD 3,000–6,000 (IMPACT) one-time; hours needed **not in the repos → to be quoted** | hours | https://www.hivestrategy.com/pricing ; getmonetizely (above) ; https://www.leanlabs.com/pricing.md ; impactplus (above) | partner range / secondary | P-S2-02, P-S2-06, P-S2-03, P-S2-05, DT-T5, DT-T6 |
| Project work if commissioned (migration of a new entity; ERP integration) | new | one-off | Migrations from USD 7,000; Integrations from USD 15,000; complex multi-hub implementations USD 10,000–25,000+ | scope | https://www.leanlabs.com/pricing.md ; impactplus (above) | partner range / secondary | P-S2-03, P-S2-05 |
| Partner seat in the portal | new | recurring | USD 0 ("a free seat that gives eligible HubSpot Solutions Partners employees access"); seat type already present on the account | seat model | https://knowledge.hubspot.com/account-management/manage-seats ; live get_organization_details seats list | official docs; live probe | P-S3-11, LC-F26 |
| Partner depth signal (context, not a cost) | — | — | Five tiers (Solutions partner, Gold, Platinum, Diamond, Elite) ranked by sourced / total points and GRR; USD 400 / month membership is the entry requirement, effective 15 Jul 2026, fee waived when the partner's net product subscription is at or above USD 400 / month; thresholds effective 15 Jul 2026 per the official page, performance enforcement from January 2027 (C136 caveat) | — | https://www.hubspot.com/solutions-partners-tiers-and-benefits-2026 | official | P-S2-07 |

S2 summary of what is new: every line above is new and recurring except audits, onboarding and project work (one-off). No Swiss / EUR price list exists in the sources; all ranges are US / UK agencies. The actual number is the pending PO.

---

## S3 · HubSpot-native tool — "Subscription (often priced by record count), setup, overlap and exit costs"

| Line | New or already incurred | One-off / recurring | Amount or range | Basis | Source | Confidence | Evidence |
|---|---|---|---|---|---|---|---|
| Data Hub Starter | new (portal tier unknown) | recurring | "Starts at" USD 7 / seat / month (annual), USD 20 / seat / month (monthly); 500 credits (pricing-page value, dated 2026-10-01) | per seat | https://www.hubspot.com/pricing/data | official list | P-S3-01 |
| Data Hub Professional (bulk duplicate management, custom duplicate rules, data-quality automation, custom-code actions, Datasets) | new (portal tier unknown) | recurring | USD 720 / month annual (USD 800 monthly); includes 1 Core Seat; additional Core Seats USD 45 / month; 5,000 credits | per hub + seats | https://www.hubspot.com/pricing/data ; gates: https://knowledge.hubspot.com/records/manage-duplicate-records ; https://knowledge.hubspot.com/reports/data-quality-command-center ; https://developers.hubspot.com/docs/api/workflows/custom-code-actions ; https://knowledge.hubspot.com/reports/create-and-use-datasets | official list / official docs | P-S3-02, P-S3-04, P-S3-05, P-S3-06, P-S3-07 |
| Data Hub Enterprise (adds bi-directional Snowflake / BigQuery / S3 warehouse integrations; duplicate pair limit 100,000) | new | recurring | "Starts at" USD 2,000 / month (annual); includes 1 Core Seat; additional Core Seats from USD 75 / month; 10,000 credits | per hub + seats | https://www.hubspot.com/pricing/data/enterprise ; https://knowledge.hubspot.com/integrations/connect-hubspot-and-snowflake-data-sync | official list / official docs | P-S3-03, P-S3-08 |
| Data Hub onboarding / setup | new | one-off | **not priced — to be quoted** (no onboarding fee shown on the Data Hub pricing page; Sales Hub shows USD 1,500 Pro / USD 3,500 Enterprise) | — | https://www.hubspot.com/pricing/data (absence) | not priced | pricing gap; P-S3-09 |
| Sales Hub seats (the deck: "by September, out of licences") | new seats on top of existing | recurring + one-off | Professional USD 90 / seat / month annual (USD 100 monthly) + required one-time onboarding USD 1,500; Enterprise USD 150 / seat / month + USD 3,500 onboarding; View-only seats USD 0 unlimited; Developer seat USD 0 | per seat; seat count needed not in repos | https://www.hubspot.com/pricing/sales ; https://knowledge.hubspot.com/account-management/manage-seats | official list | P-S3-09, P-S3-10, P-S3-11, DT-F10 |
| HubSpot Credits (Breeze / enrichment / agents) | partly incurred | recurring | **not priced — to be quoted** (the credit price and allotment row was retired in verification: C126 refuted, see evidence-ledger.md § Verification; no evidence row replaces it) | credits | — | not priced | — |
| Record-count data-management app: Insycle | new | recurring | USD 100 / 150 / 200 per month billed annually (Starter 1 module / Growth 2 / Professional all); Enterprise custom; monthly billing for databases up to 500K records | total records in connected databases | https://www.insycle.com/pricing | vendor list | P-S3-13 |
| Record-count dedupe app: Dedupely | new | recurring | USD 32 / month up to 30,000 records (Starter); Basic 60K / Pro 120K / Premium 240K / Gold 480K tiers, prices not shown; portal contacts + companies = 39,972 exceed Starter | records | https://ecosystem.hubspot.com/marketplace/apps/dedupely (vendor site unreachable via proxy) | vendor list, Starter only | P-S3-15 |
| Overlap with StackSync ("The tool's bulk and automatic fixes, overlapping StackSync") | new | recurring while both run | Data Hub Professional USD 720 / month **in addition to** StackSync USD 1,000–3,000 / month annual list for as long as both are kept; overlap ends only when one is exited | sum of two list lines | https://www.hubspot.com/pricing/data ; https://www.stacksync.com/pricing | official list + vendor list | P-S3-02, P-S1-01 |
| Overlap with the DIY warehouse (BigQuery) | new | recurring | warehouse sync is Data Hub Enterprise (USD 2,000 / month) while BigQuery on-demand continues at list | two list lines | https://www.hubspot.com/pricing/data/enterprise ; https://cloud.google.com/bigquery/pricing | official list | P-S3-08, P-S1-02 |
| Exit costs (StackSync annual term, Data Hub annual commitment, decommissioning the Go CDC / DBT pipelines) | new | one-off | **not priced — to be quoted**; StackSync and Data Hub Pro / Ent list prices are "billed annually" / "annual commitment", so the exposure is the remaining term; no public list price for exit | — | https://www.stacksync.com/pricing ; https://www.hubspot.com/pricing/data (billing terms) | not priced (term structure official) | pricing gap "Exit and overlap costs … have no public list price"; P-S1-01; P-S3-02 |
| Precedent for churn (context) | already incurred | — | 10+ tools tested, four kept; Sigma dropped after 5 weeks, Coefficient after 2; amounts not in sources | — | aya-work2026.pptx slides 7 and 25 | deck words | DT-F04, DT-F25 |

S3 summary of what is new: the Data Hub tier (whichever is chosen; the current tier is recorded nowhere, so these are list prices, not deltas), extra seats, credits beyond allotment, setup (unpriced), and the overlap period with StackSync / BigQuery. Already incurred and unchanged under S3: the existing HubSpot subscription, the Claude usage for lead triage, and the sunk DIY code.

---

## Overlap / exit view: S3 versus StackSync (the gates row "overlapping StackSync")

| Function | StackSync (S1 engine, in place) | HubSpot-native (S3) | Overlap while both run | Exit exposure |
|---|---|---|---|---|
| Bulk fixes / dedupe / formatting | sync rules + SQL (list USD 1,000–3,000 / month annual) [P-S1-01] | Data Hub Professional USD 720 / month: bulk duplicate management, custom rules (2 per object, 9 properties), formatting automation [P-S3-02, P-S3-04, P-S3-05] | both subscriptions for the transition period | StackSync remaining annual term — not priced |
| Warehouse round-trip (gold `hubspot.*`, `hs_object_id`) | StackSync external-id round-trip [HR-F15] | Data Hub Enterprise USD 2,000 / month bi-directional BigQuery [P-S3-03, P-S3-08] | Enterprise + BigQuery + StackSync | re-pointing the DBT models — not priced |
| Code-level actions | Go CDC client, planned Oban (USD 0 / USD 135–150 / month) [P-S1-06] | custom-code actions, Data Hub Pro+, 20 s / 128 MB [P-S3-06]; workflow-action component needs no Data Hub [HR-I4] | — | decommissioning — not priced |
| Record-count basis | 41,944 records inside the 50K Starter allowance | Dedupely Starter exceeded; Insycle USD 100–200 / month (the Koalify row was retired: C128 refuted) | — | — |

## Confidence summary

- Official list (HubSpot, Google, Anthropic, dbt): 12 lines (the HubSpot Credits row was retired: C126 refuted).
- Vendor list (StackSync, Oban, Insycle, Dedupely): 4 lines.
- Partner / secondary ranges (INSIDEA, HIVE, Lean Labs, IMPACT, portalpilot, getmonetizely): 7 lines; all US / UK, none Swiss / EUR.
- Order of magnitude with stated assumption: Claude API monthly; e2 VM sizes.
- Illustrative proxy: S1 operator time (portalpilot DIY audit range).
- Tracker words: "Draft PO for partner or Operations Hub … 0 … in progress"; benchmark row 54%.
- Not priced — to be quoted: Data Hub setup, hermes VPS, handover hours, exit costs, per-record credit consumption, seat count needed, the portal's current tier delta.
