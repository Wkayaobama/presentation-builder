# Structured citation metagraph — how the deck was held together, and what it teaches

Project: *Three stories, three scenarios* (WISeKey group CRM, HubSpot portal 9201667) · 2026-10-01 · companion to
`metagraph.json`, `evidence-ledger.md`, `citation_graph.py` and the two renderings in `Finished Presentations/`.

This note does four things. It shows, in plain markdown, the junction the metagraph kept between the project's inputs,
the three scenarios, the citation algorithm and the network that was built. It describes how context moved between
the subagents and the orchestrating model. It reads the timeline critically: how the strategy was adapted on the
premise of a discovery pass, how the adversarial review was run, how the inputs were categorised, and how the
presentation was built last. It ends with the premise of a reusable skill, `structured-citation-metagraph`, whose
draft lives in `.claude/skills/structured-citation-metagraph/`.

Every number below comes from the run's own journal (56 agents, 1,208 tool calls, 6.98 M tokens, 254.7 minutes of
wall clock) or from the committed files; nothing is estimated unless it says so.

---

## 1. The junction, in plain markdown

### 1.1 Inputs: what was admissible

The first decision, taken before any agent ran, was to write the context boundary down. `brief.md` names every source
that may back a claim and declares everything else inadmissible. Six families came out of it:

| Family | What it is | Visible references on the slides |
|---|---|---|
| HubSpot-Ruler | the "ruler" repo: Claude.md plan, SEALSQ property set (captured 2026-09-14), Data-Toolkit schema and prompt map, ontology workbook, hermes-agent docs, ui-extension | 79 |
| Public web pages | vendor pricing pages, HubSpot knowledge base, partner price menus, with URL and as-of date | 72 |
| Your 2026 review deck | the 27-slide corporate review, text-extracted slide by slide with notes | 61 |
| Live portal | read-only HubSQL on 2026-10-01, each fact carrying the SQL that produced it | 43 |
| Your tracker | the 21/09/26 RevOps roadmap and risk sheets, row by row | 31 |
| Hs-Logic | the standalone health service: code, README, and the two screenshots embedded in your deck | 24 |

The brief itself is the seventh source: the stories, images, scenarios and the gates table are your words, cited as
such (claims C147 to C151). That matters for the junction: a story element is admissible as *a thing you asked for*,
never as *a thing that is true*. The ledger keeps 18 such elements under "illustrative, not measured" (for example
"Team A is mostly defensive", "executives don't value data-cleaning tasks", the "hands-off" department of Team B).

### 1.2 The scenarios: what the deck had to answer

Three scenarios (S1 DIY, S2 DIY + partner, S3 HubSpot-native), six gate rows (sampling probe, schema blueprint,
rules to comply, declarative action layer, new cost lines, depends on), hence 18 gate cells, each of which had to be
tied to something that exists. The "Price $ $" placeholders became cost-line nodes (29 of them) that may only carry a
public list price with a URL or the words "not priced, to be quoted". The health check added a fourth vocabulary:
every built item gets exactly one of *keep*, *simplify*, *consolidate*, *pay for*, about the item and never about the
scenario, because the brief forbids a decision layer.

### 1.3 The citation algorithm: how the junction is scored

The uploaded plan (`citation-algorithm-entity-hierarchy.md`) scores two property notes by how often they are listed
together in a view, with a bonus for sharing a vault folder. The deck reuses it unchanged, with slides as the views
and the entity hierarchy as the folders:

```
co_citation(a, b)   = number of views (slides) that cite both a and b
folder_proximity    = 1 / 2 ** (max_depth - shared_ancestor_depth)      max_depth = 4
combined(a, b)      = 0.7 * co_citation + 0.3 * folder_proximity        (--weights)
```

The hierarchy, which plays the role of the vault folders:

```
depth 1   story · scenario
depth 2   image (illustrates a story) · gate_cell (one row × one scenario)
depth 3   data_problem · practical_example · project · cost_line
depth 4   evidence_fact   {source, locator, quote, status, caveat}
```

Three real pairs from `citation_graph.py --dry-run` show what the score does:

| Pair | co | proximity | combined | Reading |
|---|---|---|---|---|
| `dp_modelling` ↔ C067 (final_customer is a string, 931 of 1,820) | 2 | 0.500 | 1.550 | same branch, two shared slides: the fact that *defines* the problem |
| `dp_modelling` ↔ C096 (116 deals with the string and no company, live) | 2 | 0.125 | 1.438 | two shared slides but a different branch: the fact that *measures* it |
| `s2_partner` ↔ `s1_diy` | 3 | 0.062 | 2.119 | siblings that always appear together: structure, not evidence |

The proximity term is small by design (0.3 weight, halving per level), so it only breaks ties between facts that are
equally co-cited. What the score buys is a neighbourhood built from *where things were shown together*, not from
prose adjacency; the `## Co-cited` tables in `metagraph.md` are the Obsidian-style result the plan asked for.

The algorithm carries one rule that is not a score but a gate. A view may cite a node only if the node has a
`grounded_in` path to an evidence fact that carries all three of source, locator and quote. `citation_graph.py`
exits non-zero otherwise. It is this rule, not the scoring, that keeps the deck a presentation layer: a story node
with no grounded path cannot appear on a slide except as a labelled metaphor.

### 1.4 The network that was built

After verification and the one post-pass addition: 248 nodes, 676 edges, 22 planned views. By type:

| Node type | Count | Edge type | Count |
|---|---|---|---|
| evidence_fact | 153 | grounded_in | 474 |
| cost_line | 29 | enforced_by (gate cell → project) | 48 |
| project | 19 | illustrates (image → story) | 42 |
| gate_cell | 18 | depends_on | 34 |
| practical_example | 14 | costs (scenario → cost line) | 29 |
| image · data_problem | 5 · 5 | lives_in · health_verdict | 15 · 15 |
| scenario · story | 3 · 2 | built_on · connects_to | 12 · 5 |

One branch, written out, is enough to see the junction hold:

```
story2_teams                          "The types of teams"                     [brief]
└── img_teamA                         sports pitch, defensive formation        [brief → illustrative]
    └── dp_cardinality                the cardinality trap
        ├── C067  final_customer is a STRING on DEAL, 931/1,820 (51.2%)        SEALSQ_Property_Resource.md line 31
        ├── C091  1,972 live deals                                             live HubSQL, SELECT COUNT(*) FROM DEAL
        ├── C095  1,043 carry the string (52.9%)                                live HubSQL
        ├── C096  116 carry the string and no company — "related to nothing"   live HubSQL, associations.COMPANY IS NULL
        ├── C097  927 carry both: two representations of one fact              live HubSQL
        └── C053  Hs-Logic: 1,034 FC deals, 709 edge-companies excluded (capped scan)   screenshot, deck slide 27
    └── connects_to → s1_diy          "know-how can hide the problem behind individual prowess"   [brief]
```

Read top-down it is your story; read bottom-up it is a set of measurements that happen to make the story true. The
metaphor and the measurement never share a node.

### 1.5 From the network to the slides

The metagraph agent planned 22 views before any HTML existed, each with the node ids it would cite. The presentation
agent then wrote the deck so that every number sits in an element with `data-claim="Cxxx"`, and every slide carries a
hidden notes block (press N) with the claim text, its status, its caveat and its provenance line. Two checks close
the loop. `citation_graph.py` guards the plan (every planned cite is grounded). `deck_cites_check.py`, added in the
skill draft, guards the build: every id the deck actually shows exists, is not refuted, and is listed in a planned
view, with the caveated ones listed so the presenter confirms the caveat wording made it onto the slide. On this deck the
check passes: 153 distinct claim ids are shown, all 153 are in a planned view, none is refuted or unknown, and 83 of
them carry a caveat the slide or its notes must repeat.

---

## 2. Context sharing between the agents and the frontier model

"Frontier model" here is the orchestrating session: the one that read the uploads, wrote the brief, authored the
workflow script, repaired the outputs afterwards, and is writing this note. The 56 subagents ran inside a
deterministic script in six phases.

**The bus is files, not prompts.** Every agent began with the same instruction: read `brief.md` in full, treat it as
the boundary, and write the full output to a named file before returning a typed summary. Explorers wrote five JSON
files (36 to 83 KB each) of inventory items, facts and gaps, each fact with a `story_link` and an evidence triple.
The health-check agent read the five files and wrote two markdown files. The metagraph agent read all of that plus the
uploaded algorithm plan and wrote the graph, the ledger and the script. Verifiers received only their batch of eight
claims inline (about 5 KB) and returned verdicts. The maintainer received the non-confirmed verdicts inline and edited
the graph and ledger in place. The presentation agent read the graph, the ledger, the health check, the cost lines and
the design rules, and wrote the deck. QA agents read the deck and the ledger. Nothing of substance travelled inside a
prompt except the claim batches and the verdict list.

**The schemas were the contract.** Each phase returned a structured object validated at the tool layer, so a fact
without a source and locator could not be returned at all. That is what let the orchestrator avoid reading 135 facts
itself: it only counted them, logged the gaps, and sliced the claims into batches.

**Control flow stayed deterministic; judgment stayed in the agents.** The script used a barrier only where a phase
needed all of the previous phase's results together: before the health check and the metagraph (they rank and link
across sources), and after verification (verdicts are merged per claim across two lenses before anything is edited).
Verification fanned out as 20 batches × 2 lenses; QA looped up to three rounds with a fixer in between.

**What the orchestrator kept for itself.** The scouting pass (the HubSpot connector probe that found a *partner* seat
type, the two screenshots extracted from your deck, the text extracts), the brief, and a post-hoc repair pass:
rewriting scratchpad and checkout paths to repository-relative ones, removing model identifiers from a pricing line,
and adding one claim (C157, the understand.tech seed commit) that a verifier had surfaced but no agent had a channel
to file. That repair pass is a finding in itself (section 3.5).

**What it cost, by phase:**

| Phase | Agents | Wall clock | Agent-minutes | Tokens | Tool calls |
|---|---|---|---|---|---|
| Explore (5 sweeps in parallel) | 5 | 26 min | 44 | 850 k | 209 |
| Health check | 1 | 10 min | 10 | 217 k | 17 |
| Metagraph | 1 | 29 min | 29 | 304 k | 31 |
| Verify (40 verifiers + 1 maintainer) | 41 | 65 min | 107 | 3,682 k | 582 |
| Presentation | 1 | 64 min | 64 | 493 k | 111 |
| QA (2 rounds × 3 checks + 1 fix) | 7 | 60 min | 84 | 1,436 k | 258 |
| **Total** | **56** | **255 min** | **338** | **6,982 k** | **1,208** |

Verification took 53 % of the tokens. Section 3.2 asks whether it earned them.

---

## 3. A critical reading of the timeline

| When (approx.) | Who | What |
|---|---|---|
| 0:00 – 0:45 | orchestrator | read the three uploads; listed the three repos; extracted deck and tracker text; pulled the two CRM-health screenshots out of the deck; probed the portal read-only; wrote `BRIEF.md` |
| 0:45 – 1:11 | 5 explorers | 63 inventory items, 135 facts, 55 gaps |
| 1:11 – 1:21 | health check | 15 ranked items, 34 cost lines |
| 1:21 – 1:50 | metagraph | 251 nodes, 683 edges, 156 claims, 22 views, 18 unsupported story elements, guard script |
| 1:50 – 2:55 | 40 verifiers + maintainer | 69 confirmed, 83 caveated, 4 refuted and removed; guard re-run |
| 2:55 – 3:59 | presentation | script + 24-slide HTML deck |
| 3:59 – 5:00 | QA ×2 + fixer | round 1: 18 issues, 5 blocking; round 2: 16 minor, 0 blocking |
| 5:00 – 6:00 | orchestrator | render smoke test at four viewports, path rewrite, model-name scrub, C157 added, guard and idempotency re-run, commit, push |
| later turn | orchestrator | evidence-by-source trace; HTML → markdown → pptx producer with four render-and-fix rounds |

### 3.1 The discovery premise

The strategy rested on one assumption: that a discovery pass over every admissible source, run before anything was
designed, would give the metagraph builder a complete and typed inventory, so that the graph could be built *from
evidence upward* rather than *from the stories downward*. That is what happened, and it inverted the hierarchy in a
useful way. The stories and images sit at depth 1 and 2 as anchors, but the substance is 153 evidence facts at depth 4;
a story element that found no fact was not forced into one, it was listed as illustrative. Eighteen of your elements
ended up there, and the deck says so in its notes rather than pretending to measure them.

The discovery pass also produced the deck's strongest material, which the brief did not contain. The live-portal
explorer measured the cardinality trap directly (116 deals related to nothing, 927 with both representations), and in
doing so hit two traps of the query engine (counting an id column sums the ids; an association filter is silently
dropped inside a GROUP BY). Those traps became methodological facts in Appendix A, which is the right place for them:
the sampling probe is itself one of the gates.

Two weaknesses showed up later. First, the brief was a source, and it carried the orchestrator's own early readings;
the deck-tracker explorer flagged that "Oban is an Elixir job runner" came from the brief, not from your deck, and the
ledger had to say so. Second, the brief cited files by their scratchpad path, which leaked into 143 locators in the
graph and 84 in the ledger and had to be rewritten after the fact. Both argue for writing the brief inside the
project folder, with repository-relative locators, from the first minute.

### 3.2 The adversarial review

Forty verifiers, two lenses per batch of eight claims: *source fidelity* (open the cited file, re-run the cited SQL,
fetch the URL; does it say exactly this?) and *numeric and logical consistency* (recompute every ratio, catch scope
conflation: capped scan versus total, SEALSQ subset versus portal, list price versus quote). Outcome: 69 confirmed,
83 caveated, 4 refuted.

The four refutations were each a fabrication that would have sat on a cost or evidence slide: Koalify price bands that
did not exist on the vendor page (the explorer had read the calculator's default slider as a tier); HubSpot credit
allotments attributed to a page that does not carry them; an Hs-Logic provenance claim built on a `git log -8` that
truncated the history and hid the first commit; and a "discrepancy" claim that was itself wrong about what the
pricing page showed. At 3.7 M tokens that is an expensive way to find four errors. The 83 caveats are the real
return: most of them did not reject a number, they re-scoped it (partial scan, subset denominator, self-reported,
as-of date), and the maintainer wrote the caveat into the node so that the presentation agent had to carry the
caveated wording, and the fact-drift QA checked that it did. Two distinct lenses found different things; N identical
refuters would not have.

Three flaws in how it was run. A verifier's correction note on the refuted Hs-Logic claim contained the first commit
message, "seed: extracted fragments from deployed understand.tech app", which is the only evidence in any source for
your "understand tech is outsourced" example; no agent had a way to file a side-finding as a candidate claim, so it
was harvested by hand afterwards (C157). Verification ran once, on the ledger, before the deck existed; the deck's
own sentences were checked only by one QA agent per round. And refuted claims were deleted from the graph; keeping
them as negative evidence nodes would have let the deck say "two pricing claims were refuted" with a citation instead
of a footnote.

### 3.3 Categorising the inputs

Categorisation happened in three layers, and only the first was planned in advance. The brief fixed the source
families and their provenance tags (`deck-aya-work2026-pptx`, `tracker-210926`, `hs-logic-screenshot-2026-09`,
`live-hubsql-2026-10-01`, `sealsq-property-set-2026-09-14`, `public-pricing-<url>`, `brief-2026-10-01`). The
explorers, by returning typed facts, implicitly sorted claims into kinds (number, quote, status, mapping, price). The
metagraph agent then formalised the node types and depths, and the pricing explorer introduced a confidence ladder
that the cost slides carry verbatim: official list, vendor list, partner range, secondary range, order of magnitude,
illustrative, tracker words, not priced.

The health check is also a categorisation: fifteen built items sorted into four verdict words, ranked by reporting
dependency, bus-factor and cost. It was placed between discovery and the metagraph so that the verdicts became
`health_verdict` edges rather than opinions in prose.

The lesson is about timing. Kinds and confidence tiers were decided by whichever agent needed them first, so the
explorer and the metagraph agent each had to agree on them implicitly. The skill moves the vocabulary into the
explorer's output contract, so the graph builder receives categorised facts instead of inferring the categories.

### 3.4 Building the presentation last

The presentation agent ran for 64 minutes alone, after everything it would show had been verified. It turned 22
planned views into 24 slides (two appendices) and logged every departure from the plan in the slide's notes
("Deviation from the metagraph plan: …"), which is the honest way to deviate. QA round 1 found five blocking issues,
all layout (phone-width overflow on three slides, a cost slide with thirty list items); round 2 found sixteen minor
ones and nothing blocking. Nothing factual was blocking, which is the point of verifying before writing.

The orchestrator's repair pass afterwards is the uncomfortable part of the timeline: path rewriting, the model-name
scrub, the C157 addition. None of it was in the script. A method that needs an unscripted hour at the end is not yet
a method; the skill turns each of those repairs into a rule or a check that runs before the commit.

The second request, converting to PowerPoint through markdown, exposed a property of the HTML deck that the QA could
not see: it was built for a presenter with a keyboard and a notes toggle, and at 300 to 460 words per slide it is too
dense for a linear medium. The same 24 slides became 74 in pptx under an 11-line budget. That is not a conversion
defect; it is the density the brief asked for ("exhaustive", "grounded") meeting a medium that cannot hide text behind
a key press. Planning views with a word budget per target medium belongs in the method.

### 3.5 What to change next time

- Write the boundary brief inside the project folder, with repository-relative locators, and copy the source extracts
  beside it before the first agent runs.
- Put the category vocabulary (source family, kind, confidence tier, status) in the explorer's output schema.
- Give verifiers a `side_findings` field, and have the maintainer file each one as a candidate claim for a short
  second verification pass.
- Keep refuted claims as negative evidence nodes (`status: refuted`) instead of deleting them.
- Run `deck_cites_check.py` as a QA step, so the plan-to-build fidelity is checked by a script, not by one agent.
- Plan views with a budget per medium (words for HTML with notes, lines for pptx), and record the budget in the view.
- Script the hygiene the orchestrator did by hand: path normalisation, forbidden-token scrub, idempotent regeneration.

---

## 4. The premise for `structured-citation-metagraph`

A reusable skill for the case where a deck, report or brief must present grounded truth about a system against
options that someone else will decide between. Its one invariant is the presentation-layer rule: nothing is shown
that cannot be traced to a source, a locator and a quote, and nothing shown is a recommendation.

**Inputs.** A boundary brief (the request verbatim, the admissible sources, the output conventions); the sources
themselves (repositories, documents, read-only connectors, public pages).

**Roles, in order.** Explore (one agent per source family, typed facts with evidence and category) → rank (what is
built, where it lives, what it is built on, one verdict word each) → metagraph (hierarchy, edges, planned views,
ledger, guard script) → verify (two lenses per batch; confirm, caveat, refute; side-findings filed) → present (every
number carries a claim id; provenance in notes; deviations logged) → QA (render, fact drift against caveated wording,
design rules, plan-to-build fidelity) → hygiene (relative paths, forbidden tokens, idempotent regeneration) → commit.

**Contracts.** The evidence triple; the fact record with `story_link`, `kind` and `confidence`; the verdict enum; the
graph file with `meta.node_types`, `meta.edge_types`, `meta.max_depth`, `nodes[]`, `edges[]`, `views[]`; the ledger
table; the `data-claim` attribute on every rendered number.

**Scripts.** `citation_graph.py` (co-citation × proximity scores, idempotent markdown, grounded-path guard) and
`deck_cites_check.py` (build-to-plan fidelity, refuted-id detection, caveat roll-call). The workflow that ran here is
bundled as a reference skeleton; its prompts are specific to this project, its shape is not.

The draft skill, with these contracts and scripts, is at `.claude/skills/structured-citation-metagraph/SKILL.md`. It
has not yet been run on a second project; that is the next step, and the skill's own evals folder is where the
first two test prompts should go.
