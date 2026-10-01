---
name: structured-citation-metagraph
description: Build a presentation layer (deck, report, brief) whose every number and claim traces to a source, a locator and a quote, by running a discovery sweep, an evidence metagraph with co-citation scoring, an adversarial verification pass and a guarded render. Use this whenever the user wants a deck or document that is "grounded", "evidence-based", "factual", "with citations", "a presentation layer not a decision layer", or that compares scenarios, options or vendors against the truth of a system (a CRM, a codebase, a data pipeline, a budget) without recommending one; also when they mention a metagraph, citation algorithm, evidence ledger, provenance notes, or ask to audit what was built, where it lives and what it is built on. Trigger even if they do not say "metagraph": any stakeholder deck that must survive a sceptical reader qualifies.
---

# Structured citation metagraph

A deck that executives will act on has to survive one question per slide: "where does that number come from?" This
skill answers it by construction. Facts are discovered first and typed with their evidence; a graph links the story
the user wants to tell to those facts; every claim is attacked before it is shown; the deck is rendered from the graph
with the claim id on every number; two scripts refuse to pass anything that is not grounded. The result is a
presentation layer: it shows grounded truth against the options and offers no choice.

Read `references/method.md` once for the worked case this skill came from (a three-scenario CRM deck, 56 agents,
153 claims, 4 refutations). The rest of this file is the procedure.

## When the shape fits

- The user supplies or names sources (repos, documents, a live connector, public pages) and wants a deck, report or
  brief about a system against options, scenarios or vendors.
- A sceptical audience: the deck must not contain an unsourced number, an inferred status, or a recommendation.
- Dense material (dozens of facts, several source families) where an unverified synthesis would be plausible and wrong.

It does not fit a quick summary or a persuasive pitch; the overhead (one verification agent per eight claims) only
pays off when being wrong on a slide costs more than the run.

## The procedure

Six roles in order. Each writes its full output to the project folder and returns a typed summary; the orchestrator
reads summaries and file paths, never the raw material, so that its own context stays a control loop.

### 0. Boundary brief (orchestrator, before any agent)

Write `projects/<name>/brief.md` *inside the repository*, never in a scratch directory, with:
1. the request verbatim (stories, scenarios, tables the user supplied; these are admissible as "what was asked", not as truth);
2. the admissible sources, each with a provenance tag (`deck-<file>-<date>`, `tracker-<date>`, `live-<connector>-<date>`,
   `public-pricing-<url>`, `repo-<name>`, `brief-<date>`), and copies of any text extracts in `projects/<name>/sources/`;
3. output conventions: where files go, repository-relative locators, which design rules apply, what must never appear
   (session identifiers, model names, scratch paths, personal data the user did not supply).

Scout before writing it: list the repos, extract text from uploaded decks and sheets, pull embedded screenshots, probe
read-only connectors once. Thirty to forty-five minutes here saves a repair hour at the end.

### 1. Explore (one agent per source family, in parallel)

Each explorer reads the brief, then its family only, and returns `items` (what is built, where it lives, what it is
built on, status, owner dependency), `facts` and `gaps`, using the schema in `references/schemas.md`. Every fact
carries `story_link` (which story, scenario or gate row it grounds), `kind` (number, quote, status, mapping, price),
`confidence` (official list, vendor list, partner range, secondary, order of magnitude, illustrative, tracker words,
not priced) and at least one evidence triple `{source, locator, quote}`. A live-connector explorer records the exact
query with each fact and reports only what returned; a web explorer records the URL and the as-of date.

Gaps are first-class: "cannot be measured with these sources" becomes a caveat later, not an omission.

### 2. Rank (one agent, after all explorers)

Read every explorer file and produce the implementation health check: each built item with one verdict word
(keep, simplify, consolidate, pay for), ranked by dependency, bus factor and cost, with its cost line under each
scenario. Verdicts are about items, never about scenarios. Write `implementation-health-check.md` and `cost-lines.md`.

### 3. Metagraph (one agent)

Build `metagraph.json` (shape in `references/schemas.md`): a hierarchy where the user's narrative sits at depths 1–3
(story, scenario → image, gate cell → data problem, example, project, cost line) and evidence facts sit at depth 4.
Edge types: `illustrates`, `connects_to`, `grounded_in`, `enforced_by`, `costs`, `depends_on`, `lives_in`, `built_on`,
`health_verdict`. Plan the views (slides) with the node ids each will cite. List every narrative element that found no
evidence under "unsupported (illustrative, not measured)"; do not invent a fact for it.

Then run the guard and make it pass:

```bash
python3 scripts/citation_graph.py --graph metagraph.json --out metagraph.md --top-n 5
```

It scores `0.7 × co-citation + 0.3 × folder proximity` (proximity = 1/2^(max_depth − shared ancestor depth)),
writes `metagraph.md` idempotently with `[[wikilinks]]` and a co-cited table per node, and exits non-zero if any view
cites a node without a `grounded_in` path to an evidence fact carrying source, locator and quote.

Write `evidence-ledger.md`: one row per claim id (C001…), kind, text, views that use it, source, locator, quote.

### 4. Verify (adversarial, two lenses per batch)

Slice the claims into batches of about eight. For each batch run two verifiers in parallel with different lenses:
*source fidelity* (open the file at the locator, re-run the query, fetch the URL; is the quote there and does it say
this?) and *numeric and logical consistency* (recompute every ratio; catch scope conflation: capped scan versus total,
subset versus whole, list price versus quote; does the fact support its `story_link`?). Verdicts are `confirmed`,
`caveat` (with the wording the deck must carry) or `refuted`; default to refuted when unverifiable. Ask verifiers to
return `side_findings`: facts they met on the way that no claim covers.

A maintainer agent applies verdicts to the graph and ledger: caveat text into `attrs.caveat`; refuted claims kept as
nodes with `status: refuted` and dropped from every view's cites (a retired id is never reused); side findings filed
as candidate claims and verified in a short second pass. Re-run the guard.

Expect caveats to outnumber confirmations. They re-scope numbers rather than reject them; that is the main value.

### 5. Present (one agent, after verification)

Render from the graph, not from the sources: the planned views are the slide list; every number sits in an element
with `data-claim="Cxxx"`; the caveated wording is the wording shown; each slide carries a notes block with claim text,
status, caveat and provenance, toggled by a key in HTML or placed in speaker notes in pptx. Metaphors the user asked for
are drawn (inline SVG) and labelled "illustrative, not measured" where the ledger says so. Any departure from the view
plan is logged in that slide's notes. No sentence recommends an option.

Give each view a budget for the target medium before writing (words for HTML with hidden notes, lines for pptx or
print); a dense HTML slide becomes three pptx slides.

### 6. QA, hygiene, commit

Run in parallel, loop with a fixer until nothing blocks:
- render check (headless browser or LibreOffice at the sizes that matter; no overflow, no overlap, no console errors);
- fact drift: every number, quote and status word on the deck resolves to a confirmed or caveated claim with its caveat present;
- design rules of the repository;
- plan-to-build fidelity: `python3 scripts/deck_cites_check.py --graph metagraph.json --deck <deck>`.

Then hygiene, scripted, before the commit: rewrite any absolute or scratch path to a repository-relative one; grep the
deliverables for forbidden tokens (session ids, model names, scratch paths); regenerate `metagraph.md` and confirm the
guard exits 0 and the file is byte-identical on a second run.

## Invariants (the reasons, not the rules)

- **Evidence triple or nothing.** A fact without source, locator and quote cannot be verified by anyone later, so it
  cannot be shown. Typed output schemas enforce it at the tool layer; do not relax them for "obvious" facts.
- **The brief is a source, not the truth.** The user's stories, scenarios and tables are cited as their words. Early
  readings by the orchestrator (an acronym expanded, a tool identified) must be flagged as such in the brief; an
  explorer will otherwise cite them as fact.
- **Metaphor and measurement never share a node.** The image is depth 2, the fact is depth 4; the guard only looks at
  the path between them.
- **Verify before writing.** The presentation agent writes with caveated wording already decided; QA then has only
  layout to fix. Verifying after writing makes every refutation a slide rewrite.
- **Deviations are logged, not hidden.** A slide that cites more or less than its planned view says so in its notes,
  and `deck_cites_check.py` lists the difference.
- **Repository-relative from minute one.** Locators that point at a session's scratch directory are dead the moment
  the session ends; the ledger is only useful if a reader can open what it cites.

## Bundled files

| File | Use |
|---|---|
| `scripts/citation_graph.py` | scores, `metagraph.md`, grounded-path guard (`--dry-run` to inspect neighbours, `--weights` to tune) |
| `scripts/deck_cites_check.py` | build-to-plan fidelity, refuted or unknown ids, caveat roll-call (`--strict` fails on unplanned ids) |
| `references/schemas.md` | the JSON schemas for explorer, metagraph, verdict, deck and QA outputs, and the `metagraph.json` shape |
| `references/brief-template.md` | the boundary brief skeleton |
| `references/method.md` | the worked case with timings, costs and the critical reading of the timeline |
| `references/workflow-crm-three-scenarios.js` | the workflow script that ran the worked case; reuse its phase shape, rewrite its prompts |

## Pitfalls met in the worked case

- A pricing explorer read a vendor calculator's default slider as a price tier; only the source-fidelity verifier caught it.
- `git log -8` truncated a ten-commit history and hid the first commit, which carried the only evidence for one of the
  user's examples; always log without a count limit when provenance is the question.
- A live SQL engine summed an id column when asked to COUNT it, and silently dropped an association filter inside a
  GROUP BY; keep only `COUNT(*)` results and record the quirk as a methodological fact.
- Capped scans (10,000 records) produce floors, not counts; the caveat must travel to the slide.
- Scenario gist sentences ("X is our best asset") are opinions; show them as quotes attributed to the brief.
