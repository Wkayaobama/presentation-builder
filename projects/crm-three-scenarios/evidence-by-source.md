# Evidence by source — which files back which slides

Generated from `Finished Presentations/crm-three-scenarios.html` (visible `data-claim` ids only, notes excluded) and `metagraph.json` on 2026-10-01. Each claim id resolves in `evidence-ledger.md`.

## Source families (visible claim references × slides)

| Source family | References | Slides |
|---|---|---|
| HubSpot-Ruler | 79 | 3, 4, 5, 7, 8, 9, 10, 11, 13, 14, 15, 16, 19, 20, 21, 23 |
| Public web pages (pricing, docs) | 72 | 13, 14, 15, 16, 17, 18, 21, 24 |
| Your 2026 review deck (aya-work2026.pptx) | 61 | 2, 3, 4, 5, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21 |
| Live portal (read-only HubSQL, 2026-10-01) | 43 | 4, 5, 6, 7, 8, 9, 10, 11, 14, 16, 23 |
| Your tracker (AYA_trackerv4_210926.xlsx) | 31 | 4, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21 |
| Hs-Logic | 24 | 6, 7, 13, 14, 16, 21, 23 |
| Brief (your request, verbatim) | 18 | 2, 4, 6, 7, 12, 13, 14, 15, 16, 19, 21, 22 |
| This project's own docs | 11 | 13, 15, 17, 18, 19, 20, 24 |
| Hs-Logic screenshots in your deck (slides 26-27) | 4 | 6, 7 |

## HubSpot-Ruler — file by file

### `HubSpot-Ruler/Factory/agent-deployment-workbook.xlsx`

| Claim | Slides | What it grounds |
|---|---|---|
| C082 | 3, 13, 21 | hermes-agent is a scaffold, not deployed: the Factory deployment workbook lists 76 actions across 10 phases with 0 done; domain and secrets are placeholders (ag |

### `HubSpot-Ruler/hermes-agent/docs/SCOPING.md`

| Claim | Slides | What it grounds |
|---|---|---|
| C082 | 3, 13, 21 | hermes-agent is a scaffold, not deployed: the Factory deployment workbook lists 76 actions across 10 phases with 0 done; domain and secrets are placeholders (ag |
| C083 | 15, 16 | HubSpot custom-code actions and the native 'Send a webhook' action require Operations Hub (now Data Hub) Professional/Enterprise; a projects-platform workflow-a |

### `HubSpot-Ruler/hermes-agent/provision/Caddyfile`

| Claim | Slides | What it grounds |
|---|---|---|
| C082 | 3, 13, 21 | hermes-agent is a scaffold, not deployed: the Factory deployment workbook lists 76 actions across 10 phases with 0 done; domain and secrets are placeholders (ag |

### `HubSpot-Ruler/ontology_workbook_full.xlsx`

| Claim | Slides | What it grounds |
|---|---|---|
| C081 | 4, 21 | IC'Alps merge lineage (ontology workbook): deal->company fill 99.7%, deal->contact 82.5%, contact->company source-side 93.9% but all-types 37.1%, meetings->comp |

### `grep -rli over Hs-Logic, HubSpot-Ruler, . (2026-10-01)`

| Claim | Slides | What it grounds |
|---|---|---|
| C152 | 4, 19, 21 | Not in any of the three repos (named in the deck/tracker only): ic-load, Mir-Load, the DBT/BigQuery pipeline (Bq-dbt), the Go CDC client, BIBA push, StackSync c |

### `HubSpot-Ruler/SEALSQ/SEALSQ_Property_Resource.md`

| Claim | Slides | What it grounds |
|---|---|---|
| C069 | 5 | `stratification_of_lost_deals` set on 333 deals (18.3%): Competition/Price 89 · End of Life/Stale 73 · No Activity 68 · Product Issue 39 · Unknown 35 · Other 29 |
| C067 | 7, 8, 9 | `final_customer` (label 'OPP CUST - Final Customer') is a STRING property on DEAL, filled 931 / 1,820 (51.2%): HW 659 · Services 270 · SEALCOIN 1 · ICALPS 1; `s |
| C062 | 8, 23 | SEALSQ property set captured 2026-09-14 by direct HubSpot MCP calls; scope SealSQ Hardware, SealSQ Services, Icalps_hardware, SEALCOIN = 1,820 of 1,960 deals; 4 |
| C063 | 8, 10 | `wisekey___seal` is 100% filled: Seal 1,798 · Wisekey 22 — two companies' deals in the same deal set. |
| C064 | 8 | `deal_currency_code` 100%: USD 1,033 (SealSQ HW/Services/SEALCOIN) · EUR 787 (ICALPS). |
| C065 | 8 | `icalps__sealsq` is never set on deals (0%): 'the IC'Alps/SEALSQ split is carried by the pipeline'; on companies it tags only 40 of 13,422 (0.30%). |
| C066 | 8 | `product_line` filled 51.3% (933: Legacy 439 · PKI 281 · Quantum Shield 189 · ASIC 24), a 1:1 derivation of `product_hierarchy` (51.1%). |
| C068 | 9, 15 | `revenue_state` 37.4% (Pipeline 450 · BIBA 129 · Forecast 102); `hs_manual_forecast_category` 0%: HubSpot's native forecast category is NOT used in SEALSQ scope |
| C070 | 9 | `design_win_date` 84 (4.6%, all in SealSQ Hardware); `new_design_win__` and `new_design_in__` never set (0%); barely used: hs_priority 2.4%, quote_status 2.1%,  |
| C071 | 9, 15 | Year-metric naming debt: `calculation___cumulative_pipeline_2026` is labelled 'Cumulative Pipeline 2027 (k$)'; `calculation___cumulative_weighted_2026` is the ' |
| C090 | 9, 16 | Schema-type debt: `icalps_companyaddress` and `icalps_address_postcode` are typed as number on the portal; the card defers the fix to 'the portal's property con |
| C073 | 10 | IC'Alps keeps a parallel stage model inside the shared CRM: `icalps_stage` 786 deals (05 Négociations 424 · 01 Identification 144 · 04 Construction propositions |
| C089 | 23 | Object volumes at the 2026-09-14 capture: 25,782 contacts (SEALSQ flag set on 176 = 0.68%), 13,422 companies, 1,960 deals. |

### `HubSpot-Ruler/Data-Toolkit/Prompt_Resource.md`

| Claim | Slides | What it grounds |
|---|---|---|
| C067 | 7, 8, 9 | `final_customer` (label 'OPP CUST - Final Customer') is a STRING property on DEAL, filled 931 / 1,820 (51.2%): HW 659 · Services 270 · SEALCOIN 1 · ICALPS 1; `s |
| C072 | 8, 9 | The Data-Toolkit Year Resolver has 68 (metric, year) rows of which 19 are flagged RECYCLED (28%); rule R4 says resolve years by LABEL only. |
| C078 | 8 | 7 deal pipelines with 49 stage IDs; deals at capture (2026-09-14): SealSQ Hardware 728, SealSQ Services 303, Icalps_hardware 788 (EUR), SEALCOIN 1, Wisekey Serv |
| C071 | 9, 15 | Year-metric naming debt: `calculation___cumulative_pipeline_2026` is labelled 'Cumulative Pipeline 2027 (k$)'; `calculation___cumulative_weighted_2026` is the ' |
| C079 | 16, 23 | 822 deals have no product assigned (largest 'product' bucket); Breeze free-text matching on deal names under-counts (2 vs 32 for 'QVault TPM IOT'). |
| C080 | 16 | Ontology drift already measured: 18 names in the IC'Alps ontology are not found or misnamed in the live portal (e.g. icalps_company_sector not found; icalps_com |
| C087 | 23 | The Data-Toolkit encodes the S1 sampling-probe practice: 14 HubSQL rules (one object per query, no JOIN, max 2 associated objects), a 10,000-result ceiling on t |

### `HubSpot-Ruler/SEALSQ/sealsq_property_set.json`

| Claim | Slides | What it grounds |
|---|---|---|
| C062 | 8, 23 | SEALSQ property set captured 2026-09-14 by direct HubSpot MCP calls; scope SealSQ Hardware, SealSQ Services, Icalps_hardware, SEALCOIN = 1,820 of 1,960 deals; 4 |
| C078 | 8 | 7 deal pipelines with 49 stage IDs; deals at capture (2026-09-14): SealSQ Hardware 728, SealSQ Services 303, Icalps_hardware 788 (EUR), SEALCOIN 1, Wisekey Serv |
| C089 | 23 | Object volumes at the 2026-09-14 capture: 25,782 contacts (SEALSQ flag set on 176 = 0.68%), 13,422 companies, 1,960 deals. |

### `HubSpot-Ruler/Data-Toolkit/hubspot_crm_schema.json`

| Claim | Slides | What it grounds |
|---|---|---|
| C072 | 8, 9 | The Data-Toolkit Year Resolver has 68 (metric, year) rows of which 19 are flagged RECYCLED (28%); rule R4 says resolve years by LABEL only. |
| C077 | 11 | Portal 9201667 has 16 HubSpot teams (Marketing, IT, Sales Operations, Sales EMEA, Supply Chain, Product Management, Technical Sales (FAEs), Sales NORAM, Sales A |
| C079 | 16, 23 | 822 deals have no product assigned (largest 'product' bucket); Breeze free-text matching on deal names under-counts (2 vs 32 for 'QVault TPM IOT'). |
| C086 | 16 | The 'schema blueprint' today is three manual snapshots dated 2026-09-14 (Data-Toolkit schema: 565 DEAL / 40 COMPANY / 24 CONTACT / 32 TICKET / 43 ACTIVITIES pro |

### `HubSpot-Ruler/SEALSQ/SEALSQ_Property_Set.xlsx`

| Claim | Slides | What it grounds |
|---|---|---|
| C070 | 9 | `design_win_date` 84 (4.6%, all in SealSQ Hardware); `new_design_win__` and `new_design_in__` never set (0%); barely used: hs_priority 2.4%, quote_status 2.1%,  |

### `HubSpot-Ruler/ui-extension/src/app/cards/companyIcalpsPropertyConfig.ts`

| Claim | Slides | What it grounds |
|---|---|---|
| C090 | 9, 16 | Schema-type debt: `icalps_companyaddress` and `icalps_address_postcode` are typed as number on the portal; the card defers the fix to 'the portal's property con |

### `HubSpot-Ruler/ui-extension/src/app/functions/createIcAlpsDeal.js`

| Claim | Slides | What it grounds |
|---|---|---|
| C073 | 10 | IC'Alps keeps a parallel stage model inside the shared CRM: `icalps_stage` 786 deals (05 Négociations 424 · 01 Identification 144 · 04 Construction propositions |

### `HubSpot-Ruler/Claude.md`

| Claim | Slides | What it grounds |
|---|---|---|
| C074 | 10, 15 | Three companies share one HubSpot CRM (SEALSQ, IC'Alps, WISeKey) and the portal has only ONE Business Unit ('an inherent limitation'). |
| C075 | 10 | The ruler plan says 'There will be 3 agents' then lists four entity contexts (SEALSQ, IC'Alps, MIRAEX, WeCan): the tenant count grew from 3 to 4 inside the same |
| C076 | 14 | The partner role is already written into the plan: 'the splitting through teams, and conditionnal viewing of properties will be done by the operator and it's hu |
| C086 | 16 | The 'schema blueprint' today is three manual snapshots dated 2026-09-14 (Data-Toolkit schema: 565 DEAL / 40 COMPANY / 24 CONTACT / 32 TICKET / 43 ACTIVITIES pro |

### `HubSpot-Ruler/hermes-agent/docs/ARCHITECTURE.md`

| Claim | Slides | What it grounds |
|---|---|---|
| C083 | 15, 16 | HubSpot custom-code actions and the native 'Send a webhook' action require Operations Hub (now Data Hub) Professional/Enterprise; a projects-platform workflow-a |
| C088 | 16 | In hermes-agent the S1 'Rules to comply' layer is prompt text, not enforcement: write guardrails (Notes/Tasks only, never delete or merge, property updates only |
| C087 | 23 | The Data-Toolkit encodes the S1 sampling-probe practice: 14 HubSQL rules (one object per query, no JOIN, max 2 associated objects), a 10,000-result ceiling on t |

### `repo file listing (find HubSpot-Ruler)`

| Claim | Slides | What it grounds |
|---|---|---|
| C086 | 16 | The 'schema blueprint' today is three manual snapshots dated 2026-09-14 (Data-Toolkit schema: 565 DEAL / 40 COMPANY / 24 CONTACT / 32 TICKET / 43 ACTIVITIES pro |

### `HubSpot-Ruler/hermes-agent/skills/revops/hubspot-crm/SKILL.md`

| Claim | Slides | What it grounds |
|---|---|---|
| C088 | 16 | In hermes-agent the S1 'Rules to comply' layer is prompt text, not enforcement: write guardrails (Notes/Tasks only, never delete or merge, property updates only |

### `HubSpot-Ruler/hermes-agent/README.md`

| Claim | Slides | What it grounds |
|---|---|---|
| C085 | 20, 21 | HubSpot-Ruler landed on GitHub in a single upload on 2026-09-25 (3 commits, co-authored by Cursor; 76 files, 33,700 insertions); its docs still reference the ea |

### `git log --stat -5 (HubSpot-Ruler)`

| Claim | Slides | What it grounds |
|---|---|---|
| C085 | 20, 21 | HubSpot-Ruler landed on GitHub in a single upload on 2026-09-25 (3 commits, co-authored by Cursor; 76 files, 33,700 insertions); its docs still reference the ea |

### `HubSpot-Ruler/ui-extension/CLAUDE.md`

| Claim | Slides | What it grounds |
|---|---|---|
| C084 | 21 | The IcAlps CRM Card app (5 UI-extension cards + 4 serverless functions) is installed on prod 9201667 (appId 37414115, cutover 2026-04-22) and sandbox 49610528 ( |

### `HubSpot-Ruler/ui-extension/README.md`

| Claim | Slides | What it grounds |
|---|---|---|
| C084 | 21 | The IcAlps CRM Card app (5 UI-extension cards + 4 serverless functions) is installed on prod 9201667 (appId 37414115, cutover 2026-04-22) and sandbox 49610528 ( |


## Hs-Logic — file by file

### `Hs-Logic/backend/app/routes/hubspot.py`

| Claim | Slides | What it grounds |
|---|---|---|
| C052 | 6 | Missing fields across the 10,000 scanned contacts: email 1.7% (170), phone 53.3% (5,329), name 16.5% (1,651), company 31.4% (3,135). |
| C054 | 6, 7 | Orphan rule (Hs-Logic): a company is an orphan only when it has zero deal associations AND is not an edge-company AND its normalised name is not among the final |
| C055 | 6, 23 | Duplicate detection is exact-match on normalised name / domain / email (lowercase, whitespace collapsed) and duplicate_ids under-count for clusters larger than  |
| C056 | 6, 23 | Both scans stop at CAP = 10000 and flag 'cap reached — results partial'; against live totals the company scan covered 10,000 of 13,679 (73.1%) and the contact s |
| C060 | 16 | The only write Hs-Logic performs is a suppression list (static HubSpot list from NQL ids; needs crm.lists.write; CSV fallback on 403): it tags, it never merges  |

### `Hs-Logic/README.md`

| Claim | Slides | What it grounds |
|---|---|---|
| C055 | 6, 23 | Duplicate detection is exact-match on normalised name / domain / email (lowercase, whitespace collapsed) and duplicate_ids under-count for clusters larger than  |
| C057 | 13, 21 | Hs-Logic scans cost 100+ sequential HubSpot API calls (~30-90 s) and are cached in-process for 15 minutes (HEALTH_CACHE_TTL_SECONDS=900), single uvicorn worker  |
| C059 | 21 | Where Hs-Logic lives: docker-compose on a local Docker host (backend 127.0.0.1:8000, nginx frontend :8080) and a Windows laptop launch config hard-coding one us |
| C061 | 21 | Hs-Logic is built on one HubSpot private-app token (scopes crm.objects.contacts/companies/deals.read, tickets, account-info.security.read; optional crm.lists.re |

### `Hs-Logic/frontend/src/tabs/CrmHealthTab.tsx`

| Claim | Slides | What it grounds |
|---|---|---|
| C056 | 6, 23 | Both scans stop at CAP = 10000 and flag 'cap reached — results partial'; against live totals the company scan covered 10,000 of 13,679 (73.1%) and the contact s |

### `Hs-Logic/backend/app/cache.py`

| Claim | Slides | What it grounds |
|---|---|---|
| C057 | 13, 21 | Hs-Logic scans cost 100+ sequential HubSpot API calls (~30-90 s) and are cached in-process for 15 minutes (HEALTH_CACHE_TTL_SECONDS=900), single uvicorn worker  |

### `Hs-Logic (git history of Wkayaobama/Hs-Logic)`

| Claim | Slides | What it grounds |
|---|---|---|
| C157 | 14 | The user's S2 success example 'understand tech is outsourced' has a trace: the first commit of Hs-Logic (17b363a, 2026-08-28) is titled 'seed: extracted fragmen |

### `Hs-Logic/frontend/src/tabs/ContactHealthTab.tsx`

| Claim | Slides | What it grounds |
|---|---|---|
| C060 | 16 | The only write Hs-Logic performs is a suppression list (static HubSpot list from NQL ids; needs crm.lists.write; CSV fallback on 403): it tags, it never merges  |

### `Hs-Logic/docker-compose.yml`

| Claim | Slides | What it grounds |
|---|---|---|
| C059 | 21 | Where Hs-Logic lives: docker-compose on a local Docker host (backend 127.0.0.1:8000, nginx frontend :8080) and a Windows laptop launch config hard-coding one us |

### `Hs-Logic/.claude/launch.json`

| Claim | Slides | What it grounds |
|---|---|---|
| C059 | 21 | Where Hs-Logic lives: docker-compose on a local Docker host (backend 127.0.0.1:8000, nginx frontend :8080) and a Windows laptop launch config hard-coding one us |

### `Hs-Logic/backend/requirements.txt`

| Claim | Slides | What it grounds |
|---|---|---|
| C061 | 21 | Hs-Logic is built on one HubSpot private-app token (scopes crm.objects.contacts/companies/deals.read, tickets, account-info.security.read; optional crm.lists.re |

### `Hs-Logic/frontend/package.json`

| Claim | Slides | What it grounds |
|---|---|---|
| C061 | 21 | Hs-Logic is built on one HubSpot private-app token (scopes crm.objects.contacts/companies/deals.read, tickets, account-info.security.read; optional crm.lists.re |

## Slides with no HubSpot-Ruler-backed visible claim

- 1. Three stories, three scenarios
- 2. A boundary beats sixty projects
- 6. Duplicates and orphans: floors, not counts
- 12. Four images, three scenarios — what the deck and tracker already say
- 17. S1 and S2, no total: the brief’s “Price $ $” stays a placeholder
- 18. S3 at list price, not as a delta: the portal’s tier is recorded nowhere
- 22. This is a presentation layer, not a decision layer
- 24. Where every price comes from
