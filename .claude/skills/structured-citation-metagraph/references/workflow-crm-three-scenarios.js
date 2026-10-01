export const meta = {
  name: 'crm-three-scenarios',
  description: 'Explore ground truth, build the citation metagraph, verify every claim, then write and QA the three-scenarios deck',
  phases: [
    { title: 'Explore', detail: 'multi-modal sweep: Hs-Logic, HubSpot-Ruler, deck+tracker, live CRM, public pricing' },
    { title: 'Health check', detail: 'ranked keep / simplify / consolidate / pay-for with per-scenario cost lines' },
    { title: 'Metagraph', detail: 'citation metagraph, evidence ledger, co-citation script' },
    { title: 'Verify', detail: 'adversarial refutation of every claim, two lenses each' },
    { title: 'Presentation', detail: 'spoken script + HTML deck in presentation-builder' },
    { title: 'QA', detail: 'render check, fact-drift check, design-rule check, fix loop' },
  ],
}

const WORK = '<work-dir>'
const BRIEF = WORK + '/BRIEF.md'
const PB = '<repo>'
const PROJ = PB + '/projects/crm-three-scenarios'
const DECK = PB + '/Finished Presentations/crm-three-scenarios.html'
const SCRIPT = PB + '/scripts/crm-three-scenarios-script.txt'

const EVIDENCE = {
  type: 'object',
  properties: {
    source: { type: 'string', description: 'file path, "live-hubsql", "pptx slide N", "xlsx sheet/row", or URL' },
    locator: { type: 'string', description: 'line range, slide number, row text, SQL used, or URL anchor' },
    quote: { type: 'string', description: 'short verbatim excerpt or the returned value' },
  },
  required: ['source', 'locator'],
}
const INVENTORY_SCHEMA = {
  type: 'object',
  properties: {
    items: { type: 'array', items: { type: 'object', properties: {
      name: { type: 'string' }, kind: { type: 'string' }, lives_in: { type: 'string' }, built_on: { type: 'string' },
      status: { type: 'string' }, owner_dependency: { type: 'string' }, scenario_relevance: { type: 'string' },
      gate_rows: { type: 'array', items: { type: 'string' } },
      evidence: { type: 'array', items: EVIDENCE },
    }, required: ['name', 'kind', 'lives_in', 'built_on', 'status', 'evidence'] } },
    facts: { type: 'array', items: { type: 'object', properties: {
      id: { type: 'string' }, statement: { type: 'string' }, value: { type: 'string' },
      story_link: { type: 'string', description: 'which story/image/scenario/gate row this grounds' },
      evidence: { type: 'array', items: EVIDENCE },
    }, required: ['id', 'statement', 'story_link', 'evidence'] } },
    gaps: { type: 'array', items: { type: 'string' } },
    output_file: { type: 'string' },
  },
  required: ['items', 'facts', 'gaps', 'output_file'],
}

const COMMON = `
You are one of three roles (explore / metagraph / presentation) building an executive deck for the WISeKey group CRM.
FIRST read the ground-truth brief at ${BRIEF} in full. It is the context boundary: nothing outside it, the three repos
under <checkout>, read-only HubSpot queries, and public web pages with URLs is admissible. Never invent a number.
Every fact you report must carry evidence (source + locator + quote). Write your full output to the file named below
(valid JSON or markdown as asked) AND return it via StructuredOutput. Your final text is data for a script, not prose.
`

// ───────────────────────── Phase 1: Explore (multi-modal sweep) ─────────────────────────
phase('Explore')
log('Explore: five sweeps in parallel (Hs-Logic, HubSpot-Ruler, deck+tracker, live CRM, public pricing)')

const EXPLORERS = [
  { key: 'hs-logic', prompt: `${COMMON}
ROLE: explorer of <checkout>/Hs-Logic (the "hs-standalone" project). Read README.md, docker-compose.yml, backend/app/*.py,
backend/app/routes/hubspot.py (whole file), backend/requirements.txt, frontend/src/tabs/CrmHealthTab.tsx and
ContactHealthTab.tsx, frontend/package.json, .claude/launch.json, git log (git -C <checkout>/Hs-Logic log --stat -8).
Produce: (1) inventory items: what is built, where it lives (container/Cloud Run/laptop as evidenced), what it is built
on (FastAPI, React, private-app token, cache, caps), status, owner dependency; (2) facts: the exact health rules
(orphan, duplicate, NQL, MQL, multi-company), the 10,000 cap, the 15-min cache, the under-count limitation, the
suppression-list export, scopes needed; and how each rule maps to Story 2 (duplicates, cardinality trap), Gate row
"Sampling probe" (S1: your probes), and the health-check verdict (keep/simplify/consolidate). (3) gaps: what Hs-Logic
cannot measure (e.g. deals with final_customer but no company association), tests present or absent, deployment
evidence present or absent. Output file: ${WORK}/explore-hs-logic.json` },
  { key: 'hubspot-ruler', prompt: `${COMMON}
ROLE: explorer of <checkout>/HubSpot-Ruler. Read Claude.md, hermes-agent/README.md, hermes-agent/docs/ARCHITECTURE.md,
SCOPING.md, VPS-SETUP.md, hermes-agent/bridge/app.py, hermeslib/*.py, hermes-agent/skills/revops/*/SKILL.md,
hermes-agent/hubspot/workflow-action/README.md, hermes-agent/hubspot/workflow-custom-code/hermesTrigger.js,
provision/*, ui-extension/README.md, ui-extension/CLAUDE.md, ui-extension/docs/ARCHITECTURE.md, ui-extension/hsproject.json,
ui-extension/src/app/**/*.{tsx,ts,js,json} (skim), Data-Toolkit/Prompt_Resource.md, the first 200 lines of
Data-Toolkit/hubspot_crm_schema.json and prompt_property_map.json, SEALSQ/SEALSQ_Property_Resource.md (ALL 325 lines,
including Contact/Company/Ticket/stage sections), and use python3+openpyxl to dump sheet names, dimensions and the first
25 rows of ontology_workbook_full.xlsx, Factory/agent-deployment-workbook.xlsx, SEALSQ/SEALSQ_Property_Set.xlsx,
Data-Toolkit/HubSpot_Prompt_Property_Map.xlsx. git log --stat -5.
Produce: (1) inventory items for hermes-agent (bridge, scraper, VPS provisioning, workflow-action vs custom-code and
their Operations Hub / Data Hub gating), ui-extension (IC'Alps cards + serverless functions), Data-Toolkit, SEALSQ set,
ontology workbook, Factory workbook: what, where it lives, built on, status (scaffold / staged / deployed as evidenced),
owner dependency; (2) facts grounding: the 1-Business-Unit limitation and the 3-then-4 entities (landlord story), the
year-metric naming debt (business data problem), final_customer/sold_to as strings (modelling problem), the pipeline
carrying the IC'Alps/SEALSQ split and product_line fill rate (logical problem), lost-deal stratification, never-set
properties, team IDs, the 7 pipelines and stage IDs, which features need Ops Hub/Data Hub Pro+ (Scenario 3 gate), the
'blueprint' idea (Gate "Schema blueprint"); (3) gaps. Output file: ${WORK}/explore-hubspot-ruler.json` },
  { key: 'deck-tracker', prompt: `${COMMON}
ROLE: explorer of the user's own 2026 review deck and tracker. Read ${WORK}/../pptx_extract.txt (all 27 slides incl.
NOTES) and ${WORK}/../xlsx_extract.txt (all 3 sheets). Build the inventory of EVERY project named there that is NOT in the
three repos: ic-load, Mir-Load/Mr-Load, DBT+BigQuery merge pipeline (Bq-dbt), Go CDC client + SQL for deal stages,
BIBA billing push (custom objects), StackSync, "Migrate Stacksync workload to Oban" (Elixir), serverless merge workflow +
React form + Cloud Run, HS-LOGIC on Cloud Run, weekly report automation, lead AI auto-qualification, Madrid campaign
workflows, Wise.Sat Linear/GitHub, Sigma/Coefficient POCs, forecasting, marketing automation placeholder. For each:
where it lives (laptop → GCP instance, HubSpot, VPS, unknown), built on, status (success / failed / paused / dropped /
open), weeks on the list, slide + notes provenance, and whether code backup to GitHub is evidenced (tracker row 17%).
Facts: all percentages and counts (focus mix, code share 41→53→63, 10+ tools / 4 kept, 21 weeks lead triage, 13 weeks
BIBA, 4 days load, 9 months prep, 8 weeks freeze negotiation, 5 trainings, seats ran out, Benjamin left, 3 entities
queued, hygiene items 6 weeks, "CRM is not autonomous" quote, "losing money" quote, IC'Alps refused convention/tooling,
end-users idle, next-step partner assessment, SEALSQUANTUM outside HubSpot idea), plus every tracker row that names
partner / Operations Hub / Data Hub / PO / training / documentation / segmentation, with phase, engine, progress, critical
flag, and the Risks sheet statements. Map each fact to a story/image/scenario/gate row. Output file:
${WORK}/explore-deck-tracker.json` },
  { key: 'live-crm', prompt: `${COMMON}
ROLE: explorer of the LIVE HubSpot portal 9201667 via the HubSpot MCP tools (read-only; NEVER call manage_* or any
write tool). Load tools with ToolSearch: mcp__HubSpot__tool_guidance, mcp__HubSpot__search_properties,
mcp__HubSpot__get_properties, mcp__HubSpot__query_crm_data, mcp__HubSpot__get_crm_objects, mcp__HubSpot__get_organization_details.
Call tool_guidance for query_crm_data first and follow it; confirm property names with search_properties before use.
Measure, one query at a time, and record the exact SQL and raw result for each (this is the evidence):
 1. deals per pipeline: SELECT pipeline, COUNT(hs_object_id) FROM DEAL GROUP BY pipeline  (also fetch pipeline labels via
    get_crm_objects/pipelines if a tool exposes them; otherwise map IDs using SEALSQ_Property_Resource.md stage IDs section)
 2. logical problem: SELECT pipeline, product_line, COUNT(hs_object_id) FROM DEAL GROUP BY pipeline, product_line
    and SELECT pipeline, wisekey___seal, COUNT(hs_object_id) FROM DEAL GROUP BY pipeline, wisekey___seal
 3. modelling problem / cardinality trap: SELECT COUNT(hs_object_id) FROM DEAL WHERE final_customer IS NOT NULL AND
    associations.COMPANY IS NULL ; SELECT COUNT(hs_object_id) FROM DEAL WHERE associations.COMPANY IS NULL ;
    SELECT COUNT(hs_object_id) FROM DEAL WHERE final_customer IS NOT NULL ; total deals ; and a sample of 10 dealnames
    with final_customer set and no company association
 4. conversion: SELECT pipeline, hs_is_closed_won, COUNT(hs_object_id) FROM DEAL GROUP BY pipeline, hs_is_closed_won ;
    SELECT hs_is_closed_won, hs_is_closed_lost, COUNT(hs_object_id) FROM DEAL WHERE createdate BETWEEN '2026-01-01' AND
    '2026-12-31' GROUP BY hs_is_closed_won, hs_is_closed_lost ; deals created per month 2026 via DATE_TRUNC
 5. business problem: COUNT of deals where pipeline_2029__k__ IS NOT NULL vs calculation___pipeline_2025__k__ IS NOT NULL
    vs calculation___cumulative_pipeline_2026 IS NOT NULL (year fields fill), and SUM of each for open deals
 6. volumes: COUNT companies, COUNT contacts, COUNT contacts WHERE associations.COMPANY IS NULL, COUNT companies WHERE
    associations.DEAL IS NULL, companies created per year via DATE_TRUNC(createdate,'YEAR')
 7. org: get_organization_details TEAMS + SEATS (team names and sizes only; no personal data).
If a query errors, retry once with the corrected syntax per guidance, then record it as a gap. Report ONLY what returned.
Each fact: id, statement, value, story_link, evidence {source:'live-hubsql-2026-10-01', locator:<SQL>, quote:<result>}.
Output file: ${WORK}/explore-live-crm.json (include a "queries" array with sql, ok, result_or_error).` },
  { key: 'pricing', prompt: `${COMMON}
ROLE: explorer of PUBLIC cost lines for the three scenarios (the user left "Price $ $" placeholders; your job is to
replace them with sourced public list prices or ranges, each with URL and as-of date, never a guess). Use WebSearch
(mode "extended" for pricing) and WebFetch of official pricing pages. Find, as of October 2026:
 S3 (HubSpot-native): HubSpot Data Hub (formerly Operations Hub) Starter / Professional / Enterprise list prices,
 what each tier gates (data quality automation, dedupe, custom-code workflow actions, datasets, Snowflake share),
 Sales Hub Professional and Enterprise per-seat prices, the "core seat" and "view-only" seat model, partner seat
 concept, Breeze Intelligence / data enrichment credits pricing, and HubSpot's own duplicate-management limits.
 S3 alt tools priced by record count: Insycle, Dedupely, Koalify or similar HubSpot dedupe/cleanup apps (list price
 and pricing basis).
 S2 (partner): typical HubSpot Solutions Partner retainer / audit / RevOps-as-a-service public price ranges from at
 least three partner sites or HubSpot ecosystem pages (quote the page), plus HubSpot partner-tier definitions.
 S1 (DIY stack): StackSync pricing (plans, record/row basis), Google Cloud BigQuery on-demand price per TB and storage,
 Cloud Run pricing basis, a small GCE instance monthly order of magnitude, dbt Core (free) vs dbt Cloud price,
 Oban Pro price, Anthropic Claude API order of magnitude for an ops assistant (use the claude-api skill reference if
 needed), and a HubSpot private app = free.
Return facts with id, statement, value (number + currency + period), story_link (S1/S2/S3 + gate row "New cost lines"),
evidence {source:URL, locator:'as of <date>', quote}. Add a confidence field in the statement ("list price" vs "range
from partner sites" vs "order of magnitude"). Output file: ${WORK}/explore-pricing.json` },
]

const explored = await parallel(EXPLORERS.map(e => () =>
  agent(e.prompt, { label: `explore:${e.key}`, phase: 'Explore', schema: INVENTORY_SCHEMA, effort: 'high' })
    .then(r => r ? ({ key: e.key, ...r }) : null)
))
const exploredOk = explored.filter(Boolean)
const missing = EXPLORERS.map(e => e.key).filter(k => !exploredOk.find(r => r.key === k))
if (missing.length) log(`Explore: ${missing.join(', ')} returned nothing — downstream agents must treat those sources as unexplored`)
log(`Explore: ${exploredOk.reduce((n, r) => n + r.items.length, 0)} inventory items, ${exploredOk.reduce((n, r) => n + r.facts.length, 0)} facts, ${exploredOk.reduce((n, r) => n + r.gaps.length, 0)} gaps`)
const exploreFiles = exploredOk.map(r => r.output_file).join(', ')

// ───────────────────────── Phase 2: Health check ranking ─────────────────────────
phase('Health check')
const HEALTH_SCHEMA = {
  type: 'object',
  properties: {
    ranked: { type: 'array', items: { type: 'object', properties: {
      rank: { type: 'number' }, item: { type: 'string' },
      verdict: { type: 'string', enum: ['keep', 'simplify', 'consolidate', 'pay_for'] },
      rationale: { type: 'string' }, lives_in: { type: 'string' }, built_on: { type: 'string' },
      cost_s1: { type: 'string' }, cost_s2: { type: 'string' }, cost_s3: { type: 'string' },
      gate_row: { type: 'string' }, evidence_ids: { type: 'array', items: { type: 'string' } },
    }, required: ['rank', 'item', 'verdict', 'rationale', 'lives_in', 'built_on', 'cost_s1', 'cost_s2', 'cost_s3', 'evidence_ids'] } },
    cost_lines: { type: 'array', items: { type: 'object', properties: {
      scenario: { type: 'string' }, line: { type: 'string' }, amount_or_range: { type: 'string' }, basis: { type: 'string' },
      source: { type: 'string' }, confidence: { type: 'string' },
    }, required: ['scenario', 'line', 'amount_or_range', 'basis', 'source', 'confidence'] } },
    files: { type: 'array', items: { type: 'string' } },
  },
  required: ['ranked', 'cost_lines', 'files'],
}
const health = await agent(`${COMMON}
ROLE: Implementation Health Check expert (part of the metagraph role). Inputs: the explorer outputs ${exploreFiles}
(read every one; unexplored sources: ${missing.join(', ') || 'none'}). Produce the ranked list of what has actually been
built — where it ended up living and what it is built on — with a verdict per item: keep, simplify, consolidate, or
pay_for. Rank by (a) how much the current reporting/foundation depends on it, (b) bus-factor risk (one operator), (c)
cost under each scenario. For every item give the cost line under S1 (DIY: your time + open items), S2 (partner:
retainer/per-audit + handover time), S3 (HubSpot-native/tool: subscription by record count + setup + overlap + exit),
using ONLY sourced amounts from explore-pricing.json (cite the URL) or the tracker's own words ("PO pending", "to be
quoted"); write "not priced — to be quoted" where no public price exists. Map each item to the gates rows. Then write
the cost lines table per scenario (what is new vs already incurred, one-off vs recurring, and the overlap/exit cost of
S3 vs StackSync). This is a PRESENTATION layer: state truths and costs, never recommend a scenario.
Write ${PROJ}/implementation-health-check.md (ranked table + rationale + evidence ids) and ${PROJ}/cost-lines.md
(per-scenario table with provenance and confidence), creating the directory. Return the structured object with files.`,
  { label: 'health:rank', phase: 'Health check', schema: HEALTH_SCHEMA, effort: 'high' })
if (!health) throw new Error('health-check ranking returned nothing')
log(`Health check: ${health.ranked.length} ranked items, ${health.cost_lines.length} cost lines`)

// ───────────────────────── Phase 3: Metagraph ─────────────────────────
phase('Metagraph')
const CLAIM = { type: 'object', properties: {
  id: { type: 'string' }, claim: { type: 'string' }, kind: { type: 'string', description: 'number | quote | status | mapping | price' },
  used_by: { type: 'array', items: { type: 'string' } },
  evidence: { type: 'array', items: EVIDENCE },
}, required: ['id', 'claim', 'kind', 'used_by', 'evidence'] }
const META_SCHEMA = {
  type: 'object',
  properties: {
    files: { type: 'array', items: { type: 'string' } },
    claims: { type: 'array', items: CLAIM },
    stats: { type: 'object', properties: { nodes: { type: 'number' }, edges: { type: 'number' }, slides_planned: { type: 'number' } }, required: ['nodes', 'edges'] },
    unsupported_story_elements: { type: 'array', items: { type: 'string' } },
  },
  required: ['files', 'claims', 'stats', 'unsupported_story_elements'],
}
const meta_ = await agent(`${COMMON}
ROLE: metagraph builder. Inputs: ${BRIEF} (sections 1 and 2f especially), the explorer files ${exploreFiles},
${PROJ}/implementation-health-check.md, ${PROJ}/cost-lines.md, and the uploaded citation-algorithm plan at
<uploads>/f7a2079d-citation-algorithm-entity-hierarchy.md.
Build the entity hierarchy that keeps the deck a presentation layer, not a decision layer:
 Node types (hierarchy depth, like the vault folders): story (1) → image (2) → data_problem / practical_example (3) →
 scenario (1) → gate_row × scenario cell (2) → project / built_item (3) → cost_line (3) → evidence_fact (4).
 Edge types: illustrates, connects_to (image→scenario, as the user specified), grounded_in (anything→evidence_fact),
 enforced_by (gate cell→project), costs (scenario→cost_line), depends_on, lives_in, built_on, health_verdict.
 Rule: a story/image/scenario node may be cited by a slide ONLY if it has at least one grounded_in edge to an
 evidence_fact that carries source+locator+quote. List every story element from the brief that has NO evidence in
 unsupported_story_elements (e.g. "understand tech is outsourced" if nothing grounds it) so the deck can label it
 "illustrative, not measured".
Deliver in ${PROJ}/ :
 1. metagraph.json — {nodes:[{id,type,label,depth,parent,attrs}], edges:[{from,to,type,weight}], views:[{id,title,cites:[node ids]}]}
    where views are the planned slides (title + which nodes they cite). Plan 18–24 views following the brief's story
    order: title → why stories → Story 1 iceberg (2 views) → Story 2 Team A (2) → cardinality trap (1) → speedometer
    gauges (2) → messy landlord (1) → Team B (1) → bridge → Scenario 1, 2, 3 (3) → gates matrix → cost lines → health
    check ranking → where-it-lives map → closing (presentation, not decision) → appendix evidence.
 2. metagraph.md — an Obsidian-style note per node type is overkill; instead one markdown with a section per node
    carrying [[wikilinks]] to its neighbours and a "## Co-cited" table (top-5 by combined score), generated by:
 3. citation_graph.py — a standalone Python 3 script (stdlib only) that loads metagraph.json, computes
    co_citation_count(a,b) = number of views citing both, folder_proximity = 1/2**(maxDepth - sharedAncestorDepth)
    using the parent chain, combined = 0.7*co + 0.3*prox (weights via --weights), writes metagraph.md idempotently
    (replace, never append), prints the top-N neighbours per node with --dry-run, and exits non-zero listing any view
    that cites a node lacking a grounded_in path to an evidence_fact (the presentation-layer guard). Run it:
    python3 ${PROJ}/citation_graph.py --graph ${PROJ}/metagraph.json --out ${PROJ}/metagraph.md --top-n 5 and make it pass.
 4. evidence-ledger.md — every claim (id, claim text, kind, used_by views, evidence source/locator/quote). Claim ids
    like C001. Include ALL numbers the deck may show (health screenshots, SEALSQ set, deck percentages, tracker rows,
    live HubSQL results, prices) — aim for completeness over brevity (60–120 claims is expected).
Return files, the full claims array, stats, unsupported_story_elements.`,
  { label: 'metagraph:build', phase: 'Metagraph', schema: META_SCHEMA, effort: 'high' })
if (!meta_) throw new Error('metagraph returned nothing')
log(`Metagraph: ${meta_.stats.nodes} nodes, ${meta_.stats.edges} edges, ${meta_.claims.length} claims, ${meta_.unsupported_story_elements.length} unsupported story elements`)

// ───────────────────────── Phase 4: Verify (adversarial, two lenses per batch) ─────────────────────────
phase('Verify')
const VERDICT_SCHEMA = {
  type: 'object',
  properties: { verdicts: { type: 'array', items: { type: 'object', properties: {
    claim_id: { type: 'string' }, verdict: { type: 'string', enum: ['confirmed', 'refuted', 'caveat'] },
    reason: { type: 'string' }, fix: { type: 'string', description: 'corrected wording or caveat text; empty if confirmed' },
  }, required: ['claim_id', 'verdict', 'reason'] } } },
  required: ['verdicts'],
}
const BATCH = 8
const batches = []
for (let i = 0; i < meta_.claims.length; i += BATCH) batches.push(meta_.claims.slice(i, i + BATCH))
log(`Verify: ${meta_.claims.length} claims in ${batches.length} batches × 2 lenses`)
const LENSES = [
  { key: 'source', instr: `LENS = SOURCE FIDELITY. For each claim open the cited source yourself (Read the file at the locator,
re-run the cited HubSQL via mcp__HubSpot__query_crm_data read-only after ToolSearch, WebFetch the URL). Does the source
say exactly this? Wrong file, wrong number, misread label/name, quote not present, screenshot number misread → refuted.
Right but missing a scope caveat (capped scan, partial, as-of date, SEALSQ scope only = 1,820 deals not the portal) → caveat with the caveat text.` },
  { key: 'numeric', instr: `LENS = NUMERIC AND LOGICAL CONSISTENCY. Recompute every percentage, ratio, sum and date arithmetic
(e.g. 931/1,820 = 51.2%; 1,764+6,416 vs 10,000; code share 41→53→63; weeks on the list vs the 21 reported weeks; prices ×
seats × 12). Check the claim is not conflating scopes (SEALSQ 1,820-deal subset vs whole portal; capped 10,000 scan vs
total; USD vs EUR; list price vs quote) and that the story_link it supports actually follows from it (a number that does
not demonstrate the stated problem → caveat). Default to refuted=true when you cannot verify.` },
]
const verdictLists = await parallel(batches.flatMap((b, bi) => LENSES.map(l => () =>
  agent(`${COMMON}
ROLE: adversarial verifier (batch ${bi + 1}/${batches.length}, lens ${l.key}). ${l.instr}
Claims (JSON): ${JSON.stringify(b)}
Return one verdict per claim id. Be strict: a claim survives only if you could verify it yourself.`,
    { label: `verify:${l.key}:b${bi + 1}`, phase: 'Verify', schema: VERDICT_SCHEMA, effort: 'high' })
)))
const byClaim = {}
for (const vl of verdictLists.filter(Boolean)) for (const v of vl.verdicts) {
  (byClaim[v.claim_id] = byClaim[v.claim_id] || []).push(v)
}
const resolved = meta_.claims.map(c => {
  const vs = byClaim[c.id] || []
  const refuted = vs.some(v => v.verdict === 'refuted')
  const caveat = !refuted && vs.some(v => v.verdict === 'caveat')
  return { id: c.id, status: refuted ? 'refuted' : caveat ? 'caveat' : vs.length ? 'confirmed' : 'unverified',
           notes: vs.filter(v => v.verdict !== 'confirmed').map(v => `[${v.verdict}] ${v.reason}${v.fix ? ' → ' + v.fix : ''}`) }
})
const counts = resolved.reduce((a, r) => { a[r.status] = (a[r.status] || 0) + 1; return a }, {})
log(`Verify: ${JSON.stringify(counts)}`)
const applyFix = await agent(`${COMMON}
ROLE: metagraph maintainer. Apply these verification verdicts to ${PROJ}/evidence-ledger.md and ${PROJ}/metagraph.json:
${JSON.stringify(resolved.filter(r => r.status !== 'confirmed'))}
Rules: refuted → remove the claim from the ledger and delete/relabel the evidence_fact node and its grounded_in edges
(if a story/image node loses its last evidence, add it to a "## Unsupported (illustrative only)" section in the ledger);
caveat → append the caveat text to the claim and to the node's attrs.caveat; unverified → mark "unverified" in both.
Then re-run python3 ${PROJ}/citation_graph.py --graph ${PROJ}/metagraph.json --out ${PROJ}/metagraph.md --top-n 5
and fix the graph until it exits 0 (every view cites only grounded nodes). Add a "## Verification" section at the top of
the ledger with the counts ${JSON.stringify(counts)} and the date 2026-10-01. Return {files, remaining_views, guard_exit_code}.`,
  { label: 'metagraph:apply-verdicts', phase: 'Verify',
    schema: { type: 'object', properties: { files: { type: 'array', items: { type: 'string' } }, remaining_views: { type: 'number' }, guard_exit_code: { type: 'number' } }, required: ['files', 'remaining_views', 'guard_exit_code'] } })
log(`Metagraph after verdicts: guard exit ${applyFix ? applyFix.guard_exit_code : 'n/a'}, ${applyFix ? applyFix.remaining_views : '?'} views`)

// ───────────────────────── Phase 5: Presentation ─────────────────────────
phase('Presentation')
const DECK_SCHEMA = {
  type: 'object',
  properties: {
    deck_path: { type: 'string' }, script_path: { type: 'string' }, slide_count: { type: 'number' },
    slides: { type: 'array', items: { type: 'object', properties: { index: { type: 'number' }, title: { type: 'string' }, cites: { type: 'array', items: { type: 'string' } } }, required: ['index', 'title', 'cites'] } },
  },
  required: ['deck_path', 'script_path', 'slide_count', 'slides'],
}
const deck = await agent(`${COMMON}
ROLE: presentation builder. Read, in this order: ${BRIEF}; ${PB}/Claude.MD (ALL design rules: safe zones, typography
maxima, sequential animations with opacity:0 initial state, initializeSlideElements, Space/Right = next animation then
next slide, Left = previous slide, navigation dots, progress bar, dense slides, mobile breakpoints);
${PB}/style-references/apple-keynote-style-light.html (the look: light neutral background, SF-style type, glass cards);
"${PB}/Finished Presentations/ai-software-business-retro-game.html" lines 500–1100 (reuse its slide/animation JS skeleton,
not its retro styling); ${PROJ}/metagraph.json (views = your slide plan), ${PROJ}/evidence-ledger.md (ONLY confirmed or
caveated claims may appear; unsupported elements must be labelled "illustrative, not measured"),
${PROJ}/implementation-health-check.md, ${PROJ}/cost-lines.md. Load the skills "dataviz" (for the gauges and the cost
comparison) and "artifact-diagramming" (for the SVG metaphors) via the Skill tool before drawing.
STEP 1 — write ${SCRIPT}: the spoken script of the engineering manager, 12–15 minutes, lowering the technical barrier,
in the brief's story order (Story 1 iceberg → Story 2 Team A + practical examples + cardinality trap → speedometer with
the three data problems → messy landlord → Team B → the three scenarios with their gates and cost lines → the
implementation health check ranking → closing: "this is a presentation layer, not a decision layer"). Each paragraph ends
with [cites: C0xx, ...]. No recommendation anywhere.
STEP 2 — write ${DECK} as ONE self-contained HTML file (no external fonts/images/scripts; system font stack), 18–24
slides, light theme. Mandatory visuals, each an inline SVG with <title> text, drawn to fit the safe zone:
 (a) ICEBERG: waterline; above = the HubSpot UI (what executives see); below = the custom integration layer with the
 built items as labelled blocks (ic-load, Mir-Load, DBT+BigQuery, Go CDC, BIBA push, StackSync, Oban, serverless+React
 form, Hs-Logic, hermes-agent, ui-extension) sized by weeks-on-list where known; red accents.
 (b) SPORTS PITCH Team A: a defensive formation (one colour, players packed in own half) with the three practical
 examples as callouts; (c) CARDINALITY TRAP diagram: Deal → final_customer (string) vs Deal → Company (association),
 the "related to nothing" edge, and the coexisting-worse state; (d) SPEEDOMETER: three gauges (logical / business /
 modelling) with needles at the severity implied by the evidence and the evidence line under each (use dataviz meter
 guidance; amber→red); (e) MESSY LANDLORD: a house section with floor hole (foundation data layer), tenants SEALSQ,
 IC'Alps, WISeKey inside, Miraex / WeCan / SEALSQUANTUM at the door, one Business Unit sign; (f) TEAM B: multi-colour
 connected formation (sales, marketing, hands-off, technical ops) with passing lines; (g) WHERE-IT-LIVES map: HubSpot ↔
 StackSync ↔ GCP (BigQuery, DBT, Cloud Run, GCE) ↔ VPS (hermes) ↔ laptop, items not backed up to git hatched.
Also: the gates matrix as a dense table slide with row-by-row reveal; the cost-lines slide with three columns (S1 red
accent, S2 amber, S3 blue) showing sourced ranges and "to be quoted" where unpriced; the health-check ranking as cards
with keep/simplify/consolidate/pay-for badges; the closing slide stating no choice is offered. Colour psychology per
Claude.MD. Every number element carries data-claim="C0xx". Add presenter notes: each slide has <div class="notes"> with
the provenance lines (source, locator, as-of, caveat) toggled with the N key; hidden by default. Skip the lead-magnet CTA
(internal executive audience — say so in an HTML comment at the top). Respect: h1 ≤ 60px, h2 ≤ 24px, padding never >
80px vertical, all grids margin:auto, max-height guards, @media (max-height:700px) scaling, overflow hidden on .slide.
STEP 3 — self-check: run node -e with playwright (require('playwright'), chromium.launch(), viewport 1366×768 and
1920×1080) over every slide: press ArrowRight until the slide index advances, screenshot each slide to ${WORK}/shots/,
assert no element's bounding box exceeds the viewport and no .slide has scrollHeight > clientHeight+2; fix and re-run
until clean; keep the screenshots. Return deck_path, script_path, slide_count and per-slide cites.`,
  { label: 'present:build', phase: 'Presentation', schema: DECK_SCHEMA, effort: 'max' })
if (!deck) throw new Error('presentation builder returned nothing')
log(`Presentation: ${deck.slide_count} slides at ${deck.deck_path}`)

// ───────────────────────── Phase 6: QA loop ─────────────────────────
phase('QA')
const QA_SCHEMA = {
  type: 'object',
  properties: { pass: { type: 'boolean' }, issues: { type: 'array', items: { type: 'object', properties: {
    severity: { type: 'string', enum: ['blocker', 'major', 'minor'] }, slide: { type: 'string' }, description: { type: 'string' }, fix_hint: { type: 'string' },
  }, required: ['severity', 'slide', 'description'] } } },
  required: ['pass', 'issues'],
}
const QA_CHECKS = [
  { key: 'render', prompt: `ROLE: render QA. Use node + playwright (require('playwright'); chromium from PLAYWRIGHT_BROWSERS_PATH)
to open file://${DECK} at 1920×1080, 1440×900, 1366×768 and 375×667. For every slide (navigate with ArrowRight until
the active slide index stops changing; also exhaust in-slide animations), capture a screenshot to ${WORK}/qa/<vw>-<n>.png
and Read at least 6 of them visually. Assert: no text clipped or overlapping, nothing outside the viewport, no
horizontal scroll, navigation dots and progress bar do not overlap content, every SVG renders (no empty boxes), console
has no errors, N key toggles notes, Left arrow replays, first slide visible on load. Report each failure as an issue
with slide index and a concrete fix.` },
  { key: 'facts', prompt: `ROLE: fact-drift QA. Extract every number, percentage, currency amount, date, quote and status word
("failed", "dropped", "success", "refused") from ${DECK} (both visible text and .notes) and from ${SCRIPT}. For each,
find the claim in ${PROJ}/evidence-ledger.md (by data-claim id when present, else by value). Issue (blocker) for any
value with no confirmed/caveated claim, any refuted claim shown, any caveat (capped scan, SEALSQ-subset scope, list
price vs quote, as-of date) missing from the slide or its notes, any invented price, and any sentence that recommends a
scenario (the deck must present, not decide). Also check the cost columns match ${PROJ}/cost-lines.md and the ranking
matches ${PROJ}/implementation-health-check.md.` },
  { key: 'design', prompt: `ROLE: design-rule QA against ${PB}/Claude.MD. Inspect ${DECK} CSS/JS: typography maxima (h1 ≤ 60px,
h2 ≤ 24px, .big ≤ 28px, .huge ≤ 72px), slide padding ≤ 80px vertical, grids/panels margin:auto, .slide overflow hidden
and max-height guard, @media (max-width:768px) and (max-height:700px) rules, animated elements start at opacity:0 and
get .animate-in only via JS, initializeSlideElements present, Space/ArrowRight/ArrowLeft handling, no ::after duplicate
text effects, colour psychology (red = problem/DIY debt, green = intended state, blue = technology, amber = transition),
light neutral background, ≤ 12 elements per slide, one concept per slide, bridge slides between the three story blocks
and the scenarios. Also confirm the metaphors asked for (iceberg, Team A pitch, cardinality diagram, three gauges,
landlord, Team B, where-it-lives map) all exist as inline SVG with <title>.` },
]
let round = 0, qaPass = false
while (!qaPass && round < 3) {
  round++
  const results = await parallel(QA_CHECKS.map(c => () =>
    agent(`${COMMON}\n${c.prompt}\nReturn pass=true only with zero blocker/major issues.`,
      { label: `qa:${c.key}:r${round}`, phase: 'QA', schema: QA_SCHEMA, effort: 'high' })))
  const issues = results.filter(Boolean).flatMap((r, i) => r.issues.map(x => ({ check: QA_CHECKS[i].key, ...x })))
  const blocking = issues.filter(x => x.severity !== 'minor')
  log(`QA round ${round}: ${issues.length} issues (${blocking.length} blocking)`)
  if (!blocking.length) { qaPass = true; break }
  await agent(`${COMMON}
ROLE: presentation fixer (round ${round}). Fix these QA issues in ${DECK} (and ${SCRIPT} / ${PROJ}/evidence-ledger.md when
the issue is factual), keeping every other slide untouched. Issues: ${JSON.stringify(blocking)}. Minor issues to fold in if
cheap: ${JSON.stringify(issues.filter(x => x.severity === 'minor'))}. A factual issue is fixed by correcting or removing
the value, never by inventing a source. Re-run your own playwright overflow check at 1366×768 and 1920×1080 before
returning. Return {fixed:[...], skipped:[{issue, why}]}.`,
    { label: `present:fix:r${round}`, phase: 'QA',
      schema: { type: 'object', properties: { fixed: { type: 'array', items: { type: 'string' } }, skipped: { type: 'array', items: { type: 'object', properties: { issue: { type: 'string' }, why: { type: 'string' } }, required: ['issue', 'why'] } } }, required: ['fixed', 'skipped'] } })
}
if (!qaPass) log('QA: blocking issues remain after 3 rounds — see final report')

return {
  explored: exploredOk.map(r => ({ key: r.key, items: r.items.length, facts: r.facts.length, gaps: r.gaps })),
  unexplored: missing,
  health: { ranked: health.ranked.map(r => `${r.rank}. ${r.item} → ${r.verdict}`), cost_lines: health.cost_lines.length, files: health.files },
  metagraph: { files: meta_.files, stats: meta_.stats, unsupported: meta_.unsupported_story_elements },
  verification: counts,
  deck: { path: deck.deck_path, script: deck.script_path, slides: deck.slide_count, titles: deck.slides.map(s => `${s.index}. ${s.title}`) },
  qa: { pass: qaPass, rounds: round },
}
