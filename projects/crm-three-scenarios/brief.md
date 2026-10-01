# BRIEF — "Three stories, three scenarios" CRM presentation (ground-truth pack)

Date: 2026-10-01. Author of the request: the RevOps / engineering manager of the WISeKey group CRM
(HubSpot portal 9201667, portal name "WISeKey SA", currency USD, additional EUR, timezone Europe/Berlin,
seat types available on the account: core, service-starter, view-only, sales-pro, partner, developer).

This file is the ONLY context boundary. Every claim that ends up in the deck must trace to a line in this
brief, a file in the repos listed below, a live read-only HubSpot query, or a public web source with a URL.
Nothing else is admissible. If a story element cannot be grounded, say so in the deck's speaker notes
("illustrative, not measured") rather than inventing a number.

----------------------------------------------------------------------------------------------------
## 1. The request (verbatim essentials from the user)
----------------------------------------------------------------------------------------------------

Role: "Imagine you are an engineering manager that wants to lower the technical barrier in the message he
wants to convey by presenting scenarios that each convey a part of the story he wants people to bring.
The 3 scenarios are grounded into the truth of the CRM layer, and the factual remediation strategy that he
envisions. The scenarios need to be factually grounded into the task that underpins them."

Goal block: "You are an Implementation Health Check expert. You help me periodically audit what you have
actually built - where it ended up living, and what it is built on - and leave with a ranked list of what
to keep, simplify, consolidate, or pay for. You will consider all of the incurred costs for each scenario
and present grounded truth against the scenarios WITHOUT PROVIDING CHOICE but presentation only."

"In order to engage stakeholders we are to develop visual representation of the issues we aim to tackle,
hence the illustration backed up by their technical constraints and counterpart will support the
underlying message. The story is the overarching picture that governs the prospective technical
implementation that is subsequent upon choosing this story."

"The citation algorithm helps to maintain the context that governs the scenarios, and the foreseen
realisation of them, otherwise you risk getting lost in unwanted context; by keeping the tight boundary
between the desired outcome and the reality you provide a PRESENTATION LAYER, rather than a DECISION LAYER."

Agents requested: "scaffold 3 agents: one focused on the presentation, one on the metagraph building,
one that will explore."

### The 3 scenarios (user's wording, "Price $ $" placeholders are the user's — do not invent prices)

1. **DIY — do everything yourself with the cloud stack and AI** (Price $ $)
   Gist: "Now AI can do everything, why do we need to pay other useless service and you have sufficient
   knowledge to do everything by yourself." Projects: Mr-Load (a.k.a. Mir-Load), Ic-load, Bq-dbt.
2. **Same as 1 + an expert CRM partner to help with the enablement of the team** (Price $ $)
   Examples of success given by the user: former team-mate onboarding; StackSync is outsourced;
   "understand tech" is outsourced. Gist: "The problem is not a technical problem, it's a people and
   skill gap between the understanding of the tool and the realistic implementation of it."
3. **Stop technical process and focus on HubSpot-native tools (multiple hubs, data automation)** (Price $ $)
   Gist: "HubSpot is our best asset, we should stop looking somewhere else and focus on the tool that
   drives the company reporting strategy; other things will be by-products of it."

### The gates table (user-supplied, verbatim)

| Gate | S1 · DIY loading, keep as is | S2 · Partner monitors and feeds back | S3 · New tool fills the deployment gap |
|---|---|---|---|
| Sampling probe | You, via HubSpot SQL queries, Breeze and StackSync SQL | Partner audits independently; your probes continue | The tool's built-in scans |
| Schema blueprint | Blueprint cards, owned by you | Cards stay yours; partner reviews changes before they ship | Cards stay yours unless the tool's model replaces them |
| Rules to comply | _rules and import flags, enforced in icload and StackSync | Partner co-writes a governance playbook across entities | The tool's rule engine covers part of it |
| Declarative action layer | StackSync and HubSpot workflows, plus the Elixir sync if built | Unchanged, or partner configures the HubSpot-native part | The tool's bulk and automatic fixes, overlapping StackSync |
| New cost lines | None new: your time plus the ongoing cost of the open items | Retainer or per-audit fees; time to hand over knowledge | Subscription (often priced by record count), setup, overlap and exit costs |
| Depends on | One operator plus the engine | The partner's HubSpot depth and access (the account already offers a partner seat type) | Naming which gap the tool closes |

### The stories and images (user's wording; these are the slides' visual metaphors)

**Story 1 — The DIY technical debt.** Image: an ICEBERG. The emerged part = the UI layer of the CRM;
the submerged part = the coding and integration part. Context: most of the implementation in the current
CRM was made in-house; the CRM is not autonomous, it is controlled and upgraded through custom
integration. Failure to understand the customisation part of the CRM (vs an "autonomous system") explains
why executives don't value data-cleaning tasks, and illustrates failure to understand the need to make
data reliable before acting on it.

**Story 2 — The types of teams.** Image: a SPORTS TEAM.
Team A is mostly defensive, content with the current data structure, sees the CRM as a static tool to
aggregate data and report on it. Message: HubSpot is not a static database but a growth engine that
needs a solid foundation; individual exploits will not always be a means to compete at the highest level
and drive growth through outbound / inbound / hands-off. Practical examples: failing conversion rate, low
number of opportunities at NEW customers, multiple duplicates (show with the hs-standalone project =
Hs-Logic), and the critical CARDINALITY TRAP: the "final customer" property was used in lieu of the
company object, creating edge cases where deals are related to nothing → the need for a clean data model.

**Image 2 — The car SPEEDOMETER.** Three gauges illustrating the severity of three types of data problem:
- Data problem 1, the LOGICAL data problem: one pipeline serving multiple products for multiple companies
  creates a logical problem when one wants to report on a company-specific product line.
- The BUSINESS data problem: the company fails to capture in the CRM the thing it wants, creating
  inaccurate or false data. Example: reporting the full pipeline 2026–2029 but omitting 2029, the most
  important value, because the property was not named properly.
- The DATA MODELLING problem: representing the final customer of a deal as a deal property instead of an
  associated company; on realising it, companies get created, which is worse because the two now
  coexist and prevent a proper bucket by company.
Connect to Scenario 1 (DIY): technical know-how can also create technical debt by hiding the problem
behind individual technical prowess.

**Image 3 — The MESSY LANDLORD.** A landlord welcomes a new tenant into a big property (the CRM); the
tenant is then asked to fix the hole in the floor himself (the foundation data layer) → tense relationship
between the new tenant, the landlord and the other tenants. Message: the risk of hosting multiple
companies in a CRM whose foundation is shaky. Connect to Scenario 2: a partner acts as intermediary in the
tense relationship and helps fix the underlying data issue, promoting a symbiotic relationship where,
with clean boundaries between occupants, sharing is controlled instead of messy.

**Image 4 — Team B, the intended team.** A team with multiple colours (departments): sales, marketing,
hands-off, technical operations, connected. Context: we are not there yet, but fixing the three previous
images brings us toward this outcome.

----------------------------------------------------------------------------------------------------
## 2. Ground truth already extracted (with provenance)
----------------------------------------------------------------------------------------------------

### 2a. Live CRM health numbers — screenshots embedded in the user's deck (slides 26–27), from the
Hs-Logic "CRM Health" / "Contact Health" tabs (portal 9201667). Scan capped at 10,000 records, so
results are PARTIAL. Files: projects/crm-three-scenarios/sources/hs-logic-contact-health-2026-09.png, projects/crm-three-scenarios/sources/hs-logic-crm-health-2026-09.png.
- Contact Health: scanned 10,000 contacts (cap reached). NQL (not qualified for CRM: no email+no phone,
  or no name) = 1,764. _MQL = 6,416. Duplicate clusters = 281. Multi-company contacts = 193 (violate
  single-company cardinality). Missing fields across the 10,000: email 1.7% (170), phone 53.3% (5,329),
  name 16.5% (1,651), company 31.4% (3,135).
- CRM Health (companies): scanned 10,000 companies (cap reached), 1,034 deals with `final_customer`,
  709 edge-companies excluded. Orphan companies = 9,150 (zero deal associations, not edge-connected,
  name not a final_customer on any deal). Duplicate clusters = 226. Example orphans: World Micro,
  Domainregistrationcorp, Revilian, eidoo.io, indiabusinessconsulting.in.
- The orphan/duplicate logic: Hs-Logic/backend/app/routes/hubspot.py lines 294–466 and
  480–620 (docstrings describe the rules; README notes duplicate_ids under-count for clusters >10).

### 2b. SEALSQ property set captured 2026-09-14 by direct HubSpot MCP calls
File: HubSpot-Ruler/SEALSQ/SEALSQ_Property_Resource.md (325 lines; sections: Excluded,
Utilisation (live), SEALSQ-specific deal properties, ICALPS legacy, Contact, Company, Ticket, stage IDs).
Scope: SealSQ Hardware, SealSQ Services, Icalps_hardware, SEALCOIN = 1,820 deals; the portal has
"7 deal pipelines". Key facts:
- `wisekey___seal` 100% filled: Seal 1,798 · Wisekey 22 (two companies' deals in the same deal set).
- `deal_currency_code` 100%: USD 1,033 (SealSQ HW/Services/SEALCOIN) · EUR 787 (ICALPS).
- `icalps__sealsq` 0% — "the IC'Alps/SEALSQ split is carried by the pipeline".
- `product_line` 51.3% filled (Legacy 439 · PKI 281 · Quantum Shield 189 · ASIC 24); `product_hierarchy` 51.1%.
- `final_customer` (label "OPP CUST - Final Customer", STRING property on DEAL) filled 931/1,820 (51.2%):
  HW 659 · Services 270 · SEALCOIN 1 · ICALPS 1. `sold_to` also a string. → the cardinality trap.
- `revenue_state` 37.4%: Pipeline 450 · BIBA 129 · Forecast 102; `hs_manual_forecast_category` 0% (HubSpot
  native forecast category NOT used; custom equivalent instead).
- `stratification_of_lost_deals` 333: Competition/Price 89 · End of Life/Stale 73 · No Activity 68 ·
  Product Issue 39 · Unknown 35 · Other 29.
- `design_win_date` 84 (4.6%); `new_design_win__` and `new_design_in__` never set (0%).
- YEAR-METRIC NAMING DEBT (the "business data problem" evidence): internal names do not match labels.
  `calculation___cumulative_pipeline_2026` is labelled "Cumulative Pipeline 2027 (k$)";
  `calculation___cumulative_weighted_2026` is the "Pipeline 2027 field"; `asp_in_usd_q3_2021_calculation`
  is the "Pipeline 2028 field"; `asp_in_usd_q1_2022_calculation` = "Weighted 2028 (k$)";
  `asp_in_usd_q2_2021` = "ASP 2028 (Hardware Only)"; `pipeline_2029__k__` = "Pipeline 2029 (k$)" (a
  different naming scheme from `calculation___pipeline_2025__k__`); `weighted_2021_calculation` =
  "Weighted 2027 (k$)"; `amount_lost` = "Weighted2027[BI]"; `num_deal_date_identified_` = "Pipeline
  2027[BI]"; `asp_in_usd_q2_2022_calculation` = "ARR ($K/Y)" (recycled field). Both `pipeline2026` and
  `calculation___pipeline_2026__k__`-style fields coexist. A report built by internal name can silently
  pick the wrong year.

### 2c. The user's own 2026 corporate review deck (aya-work2026.pptx, 27 slides, Jan→Sep 2026)
Full text: projects/crm-three-scenarios/sources/aya-work2026-pptx-extract.txt. Key facts:
- 21 weekly reports, ~60 projects tracked, 6 categories. Focus mix of active project-weeks: Data 35%,
  DevOps 22%, Marketing 17%, Process/Ops 17%, Admin 6%, Other 3%.
- Code vs manual: code share grew 41% → 53% (Q1→Q3); last reported week (14 Sep) 63% code.
  Switched to code: regional weekly report (11 weeks by hand → workflow in Jun); deal stages (HubSpot UI
  → Go CDC client + SQL, Aug); BIBA (local Python → scheduled push into HubSpot as custom objects, Aug);
  Mir-Load (laptop → GCP instance, Sep); lead triage (19 weeks manual → AI auto-qualification from 7 Sep).
  Still by hand: campaign sends, dashboards, cleanup, templates.
- Ic'Alps → HubSpot merger: 9 months prep, 4 days to load full data in production (mid-May), ~6 weeks
  active follow-up; Ic'Alps users trained afterwards; separate deal-stage conventions kept; "IC'Alps
  refuse the deal stage unified convention". Merge tooling (serverless workflow, React entry form, code
  review with a temporary contributor) = "Failed (IC'Alps refused to use it in the end)".
- BIBA billing report: 13 weeks of work; "technical implementation was a success but end-users were
  idle"; infrastructure refactored into the pipeline for Miraex / WeCan ETL. ERP (SAP) reconciliation
  and fixed metadata schema still open in September. 3 new entities queued: Miraex, WeCan, SEALSQUANTUM.
- DevOps: "10+ tools tested; four kept: DBT, BigQuery, Stacksync, HubSpot serverless". HubSpot deal-stage
  workflow Apr→Aug finished with Go CDC client + SQL + GCP infra = "#1 success post merge". "Migrate
  Stacksync workload to Oban" (6 weeks on the list; Oban = Elixir job runner → the "Elixir sync" in the
  gates). Four hygiene items (cleanup, backups, codebase migration) recurred six weeks, none closed.
  "The CRM is not autonomous, it requires constant attention to avoid data drifts."
- Marketing: inbound lead triage 21 weeks on the list (every reported week); "we are losing money not
  being able to select the relevant leads"; lead-forward automation broken for 3 reporting weeks (Jun);
  new CMO onboarded Aug; 5 workflows for the Madrid campaign; marketing team trained to run HubSpot.
- Process/Ops: CRM freeze negotiated with Ic'Alps over 8 weeks incl. a Geneva visit; 5 training /
  onboarding sessions (9 weeks carry one). Question raised: how to replicate for Miraex or WeCan.
- Admin: ISO 27001/14001/9001; May audit passed with one red flag; HubSpot seats ran out by September;
  "Benjamin left with no replacement in sight"; "Technical Debt".
- "What keeps coming back" slide: the role changed yet few understand; upgrading infrastructure is no
  longer optional to scale; SEALSQ attempts isolation in its BUs; the data is poor but nobody wants to
  look at it; AI severely underutilised; sales stakeholder turnover concerning.
- Pressure (Sep 2026): brittle reporting pipeline (Miraex, WeCan, SEALSQUANTUM loaded into a model whose
  robustness depends on the code pipeline); leads and campaigns; unpaid hygiene debt; HubSpot licences &
  misconception. Next step: assess a HubSpot partner for items 1–3; assess not using HubSpot for
  SEALSQUANTUM to preserve data quality.
- Stalled/dropped: Marketing automation at 5% since June 2024; Sigma Computing POC dropped; Coefficient /
  Google Sheets dropped; 5-year forecast on hold; "BIBA + CRM (may be dropped)".
- Mir-Load: replicates the ic-load pattern that carried the Ic'Alps merge; BigQuery + Cloud Shell + DBT +
  Python on a remote GCP instance; first run worked; HubSpot schema still to extend.
- HS-LOGIC: serverless query layer on Cloud Run (Sep).

### 2d. The tracker (AYA_trackerv4_210926.xlsx, checkpoint 21/09/26, manager Nathalie Verjus)
Full dump: projects/crm-three-scenarios/sources/AYA_trackerv4_210926-xlsx-extract.txt. Sheet "RevOps 6-month plan (2)" = CRM Operation Roadmap
(Jul→Dec 2026): 19 tasks, 0 complete, 5 in progress, 14 not started. Engines: Foundation → E2 (rebuild a
cleaner data structure) → E3 (leverage data for GTM / RevOps) → E4 (self-autonomous AI-powered CRM).
Rows that matter for the scenarios:
- "[DATA] Partner to clean CRM companies & groups – assess best solution: remove duplicates and
  inconsistent group structures, after benchmarking an external partner against HubSpot Operations Hub"
  (MEDIUM, Foundation, 54%, critical, in progress). → S2 vs S3 benchmark is already a tracked task.
- "[DOC] Draft PO for partner or Operations Hub" (in progress). → cost line is pending a quote.
- "[FEATURE] Automate data health after merging records – with Operations Hub or partner – by scoring
  records" (E2, not started).
- "[FEATURE] Module for grouping companies from the same HQ (needs Data Hub or partner)" (E2).
- "[DATA] Load Miraex and WeCan group in the CRM" (54%, critical) and "[DATA] Analyze Miraex and WeCan
  group for stale / not useful data" (10%).
- "[DATA] Resolve critical data issues" (18%, critical); "[ADMIN] Train former users on duplicate
  prevention & formatting" (0%).
- "[ADMIN] Document workflows and scripts, update GitHub for code backup — ensure no technical debt or
  hard dependency on any user" (HIGH, E4, 17%).
Sheet "Risks" (21 rows, all 0% complete) has the risk statements: e.g. "Too much data drift gets only
noticed in the quarterly meeting"; "Different value granularity causes increasing drift across entities
preventing unified reports"; "Legacy knowledge disappears when key stakeholders leave"; "Progressive
abandonment of the tool in favour of legacy patterns"; "[DATA] Define existing-customer vs new-customer
segmentation rules — useful for audit/SOX" (not started → the 'new customer opportunity' blind spot);
"[DATA] Set up data catalog for HubSpot properties (defs, owners, usage)" (critical, 0%);
"[INFRA] Add observability & alerting on HubSpot CDC sync failures" (0%).

### 2e. The repos (what is actually built, where it lives, what it is built on)
- Hs-Logic — "Hubspot-Logic-Server": FastAPI backend + React/Vite frontend, docker-compose,
  portal explorer and CRM health analytics (orphans, duplicate clusters, NQL/MQL, suppression lists).
  Built on HubSpot private-app token, in-process 15-min cache, single worker, 10,000-record cap. The
  deck calls it "HS-LOGIC serverless query layer on Cloud Run". This is the "hs-standalone" project.
- HubSpot-Ruler — the "ruler" context repo: Claude.md (3 companies share the CRM: SEALSQ,
  IC'Alps, WISeKey; Brands/Business Units limitation: only 1 BU; plan = classify records per entity,
  build a generalised ontology/blueprint, 4 context agents: SEALSQ, IC'Alps, MIRAEX, WeCan; a
  foundation model oversees drift/duplicates/orphans/stale). Contents: Data-Toolkit (hubspot_crm_schema
  .json, prompt_property_map.json, Prompt_Resource.md), SEALSQ property set (md/json/xlsx),
  ontology_workbook_full.xlsx, Factory/agent-deployment-workbook.xlsx, hermes-agent (Python bridge +
  Telegram scraper + VPS provisioning + HubSpot workflow-action; docs/ARCHITECTURE.md, SCOPING.md note
  that custom-code actions need Operations Hub / Data Hub Pro+ while the workflow-action route does not),
  ui-extension (HubSpot UI extension: IC'Alps cards + serverless functions createIcAlpsCompany/Contact/
  Deal, updateDealProperties).
- . — the deck factory (Claude.MD = design rules; scripts/; style-
  references/; "Finished Presentations/"). The deliverable deck goes here.
- NOT in any repo (named in the deck/tracker only): ic-load, Mir-Load (Mr-Load), the DBT/BigQuery merge
  pipeline (Bq-dbt), the Go CDC client for deal stages, BIBA push, StackSync, the Oban/Elixir migration,
  the serverless merge workflow + React form. Treat their status as "reported in the weekly reports,
  code not in the three repos available to this session" — that itself is a health-check finding
  (the tracker's own row "update GitHub for code backup" is at 17%).

### 2f. The citation-algorithm plan (uploaded md) — the pattern to reuse for the metagraph
Two entities are co-cited when they appear in the same "view"; folder proximity adds a bonus:
combined = co_citation × 0.7 + folder_proximity × 0.3, where folder_proximity = 1/2^(maxDepth −
sharedAncestorDepth). Output: top-N neighbours injected as [[wikilinks]] (frontmatter + "## Co-cited"
table), idempotent (replace, never append). For this deck: "views" = slides/stories; "entities" =
stories, images, scenarios, gates, projects, data problems, evidence facts, cost lines. The metagraph is
what keeps the deck a presentation layer: a slide may only cite entities that have an evidence edge.

----------------------------------------------------------------------------------------------------
## 3. Output conventions
----------------------------------------------------------------------------------------------------
- Deliverables live in . (git branch claude/affectionate-brahmagupta-r8n7t5):
  - scripts/crm-three-scenarios-script.txt — the spoken story script (the repo convention is script → deck)
  - Finished Presentations/crm-three-scenarios.html — the deck (pure HTML/CSS/JS, no external assets)
  - projects/crm-three-scenarios/ — metagraph.json, metagraph.md, citation_graph.py,
    implementation-health-check.md, evidence-ledger.md, cost-lines.md
- Follow Claude.MD for layout, typography limits, safe zones, sequential
  animations, keyboard controls. Audience here is EXECUTIVE STAKEHOLDERS (not YouTube): skip the lead-
  magnet CTA; end with a "presentation, not a decision" closing slide. Neutral light background
  (base the look on style-references/apple-keynote-style-light.html). Colour psychology: red = DIY debt /
  problem, green = intended state, blue/cyan = technology, amber = transition/caution.
- All illustrations (iceberg, pitch, gauges, landlord, Team B) are inline SVG drawn in the HTML.
- Numbers in the deck must carry a provenance tag in speaker notes / data-source attribute
  (e.g. data-source="hs-logic-screenshot-2026-09", "sealsq-property-set-2026-09-14", "tracker-210926",
  "live-hubsql-2026-10-01", "public-pricing-<url>").
- Intermediate agent outputs go to scratchpad/work/ (this directory).
