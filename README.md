# Beyond the Numbers — Customer Intelligence & Research Lab

Release 0.8: all six research modules, two guided entry experiences and a professional experience / role-alignment page. Open `index.html` in a modern browser; no installation, server, API key or internet connection is required (public source links do require internet). The website is a self-contained prototype for easy review and future migration into a modular repository.

## Start here
- `index.html` or `#home`: portfolio overview and choice of two experiences.
- `#executive-1` through `#executive-5`: a roughly five-minute, self-paced decision narrative. Each stop links to the detailed supporting module; the sidebar resumes the current tour step in this browser session. Tour numbers are fixed baseline snapshots, not live filtered values.
- `#technical`: six-module capability map with suggested experiments, methods, limitations and available exports.
- `#experience`: professional background, selected examples of transferable work, and a role-alignment matrix linking experience to the independent demonstrations. Career facts are based on the author's public professional portfolio at https://travis-mccormack-analytics.com/ ; no private CV or internal employer material is reproduced. Distinguish demonstrated methods from claims about employment experience.
- `#module-1` through `#module-6`: direct entry to any original interactive module. Browser history and hash navigation preserve these routes.

## Roadmap
1. Executive insights hub — implemented: public scorecard, executive decision brief, synthetic study filters, Wilson intervals, cross-tabs, association analysis, CSV export, research recommendations and source register.
2. Research methodology — implemented: questionnaire split-ballot design, calibration and Kish effective sample size, cross-tabs, independent-wave z-test and fixed-mix tracking. Includes proposed research approval gates.
3. Customer segmentation — implemented: six 1–7 synthetic needs ratings, standardized K-means++ (k=2–6, five starts), sampled silhouette, holdout resampling ARI, PCA visualization, calculated profiles, CSV export and responsible-use safeguards.
4. Voice of Customer — implemented: linked synthetic service journeys and feedback, browser-trained multilabel logistic regression and tone classification, generated-label validation, independent session-only reviewer coding, cross-source triangulation, wave monitoring and CSV export.
5. Research portfolio & budget — implemented: research intake register, adjustable weighted scoring, exact subset optimization with budget/contingency/staffing/dependency/overlap constraints, manual selection, quarterly roadmap, spend forecast, scenario comparisons, compliant supplier evaluation and CSV export.
6. Leadership & governance — implemented: proposed operating model and RACI, partnership cadence, integrated evidence register, interactive stage gates, fictional capability self-assessments and coaching plans, management scorecard, dependency-aware 90-day milestones and JSON export.

## Data contract
`PUBLIC` contains historical aggregate measures from published annual reports. The synthetic `survey` array contains 2,400 independently generated observations across four fictional waves: id, wave, primary channel, four binary reported barriers, product and service satisfaction flags. Release 0.3 extends each record with `needs` (six integer 1–7 importance ratings; fixed order defined by `NEEDS`). This synthetic feature generator uses overlapping planted patterns, a separate deterministic seed and modest barrier-related shifts; it preserves all original survey outcomes. Satisfaction and channel are descriptive profiling outcomes, never clustering inputs. `MODULES` registers the six module views. Later modules should reuse this shared schema and distinguish public, synthetic and proposed evidence; expand it deliberately rather than treating the artificial observations as real customers. Do not compare simulation levels to actual OLG scores, or identify causal effects from the synthetic cross-tabs.

## Segmentation methodology (0.3)
- Full-sample exploratory K-means using standardized importance ratings; compare within-cluster sum of squares and sampled silhouette (320 fixed random records). The PCA projection uses two orthogonal components of the same standardized features.
- Stability is mean pairwise ARI of three models fit on 75% subsamples of the training pool, each with its own standardization, evaluated on a common 600-record holdout. This is internal resampling stability, not external validation.
- Suggested k maximizes sampled silhouette among candidates with ARI ≥ 0.65 and minimum share ≥ 5%. These are illustrative review gates, not validated industry standards. Near-ties and modest silhouette scores require substantive review; never infer real segments from planted synthetic structure.
- Use segment profiles only to formulate hypotheses about accessibility, service quality, information clarity and informed choice. No promotional targeting or individual risk inference.

## Voice of Customer methodology (0.4)
- Generates one fictional service task per survey ID and a nonrepresentative feedback subset. Barrier-linked failure and feedback patterns are intentional simulation assumptions. The survey and segment inputs remain unchanged.
- Trains separate one-vs-rest binary logistic regressions (unigrams/bigrams, deterministic sparse SGD, regularization) for five themes and four tone classes on 1,440 generated examples. Evaluation uses a different template bank with shared structure and vocabulary; reference labels are generator labels, not human annotations. No external AI service or internal customer data.
- Theme threshold controls classification, micro F1, exact theme-set agreement and per-theme precision/recall. Tone is highest-scoring category. The illustrative quality screen requires micro F1 ≥ 75% and recall ≥ 70% for every theme. Default model fails this screen; the executive briefing warns against using automated rankings as decision evidence and prioritizes manual review. Even passing the synthetic screen does not establish production readiness. Scores are not calibrated probabilities. Report evaluation as synthetic benchmark, not real-world validation; formal model development requires a separate tuning set and untouched human-coded evaluation.
- Session-only blinded review queue of 24 randomly sampled comments allows the visitor to enter independent theme codes before seeing automated labels; reviewer agreement is not evidence of production readiness. A review may be exported with the fictional feedback CSV.
- Triangulation uses different denominators for submitted comments, survey barriers and simulated journey completion. Small groups are suppressed; wave comparisons are descriptive. Do not infer real-world causes or use tone/segment labels for individual gambling risk or promotion.

## Research portfolio methodology (0.5)
- Ten fictional project requests connect to the shared case study. Costs are CAD thousands of external research spending (internal salaries excluded); capacity is net internal staff-months per quarter. The default annual budget is $500,000 with 10% contingency, and 10 staff-months per quarter. None of these assumptions is actual OLG budget or staffing data.
- Normalize four adjustable criteria weights and calculate weighted 1–5 ratings on a 0–100 scale. Exact enumeration of 1,024 subsets maximizes total additive priority subject to budget after reserve, quarterly capacity, required TRACK and VOCQA, optional strategic guardrail requiring ACCESS and HEALTH, dependencies and CLARITY/DUP overlap. Lower cost breaks equal-score ties. Scores are ordinal management judgments, not impact estimates or ROI. Manual selections can be infeasible and receive explicit warnings. The default score-maximizing plan omits dedicated accessibility and player-health studies, so the strategic guardrail can be selected to compare a plan that protects those studies. The management decision must not rely solely on total additive scores.
- Quarterly project costs and load are fixed assumptions; validate detailed milestones and dependency timing separately. Forecast at completion = fictional actual spending to cutoff plus remaining planned spend adjusted by the remaining-cost scenario. Spending exercise is not a financial record.
- RFP simulation screens mandatory criteria before ranking. Technical subweights are fixed; price is the lowest compliant bid divided by the evaluated compliant bid. Weight sensitivity illustrates pre-RFP planning only, not adjustment of a live tender. Supplier names, bid values and scores are fictional. The ranking is not an award and does not alter the research plan.

## Leadership & research governance methodology (0.6)
- Proposed reporting and capability model, decision rights and partnership forums are illustrative, not actual OLG reporting lines, staffing, procurement or approval policies. Governance scenarios are not authorizations.
- Evidence register references historical public KPI anchors, fixed illustrative calibration example, calculated synthetic segmentation and baseline classifier metrics, and the current Module 5 portfolio selection (or the suggested scenario if not initialized). Operational segmentation and automated VoC release remain blocked without independent real-world validation, even if every simulated check is marked complete. Portfolio review additionally requires a feasible plan and the proposed dedicated accessibility/player-health guardrail.
- Three fictional role profiles use editable ordinal skill assessments and a common development target. The two largest gaps guide coaching discussion, not staff ranking or HR decisions. Scorecard reports simulated numerators and denominators; zero denominator is unmeasured, not zero performance.
- The 12-milestone first-90-days roadmap enforces dependencies and recursively clears dependent completion when a prerequisite is reopened. All review, coaching and roadmap state is session-only; JSON export is an illustrative scenario record. No personnel data or external transmission.
- Transferable leadership principles are framed as a proposed approach, not independently verified employment claims.

## Local regression smoke test
Run `node tests/smoke.mjs` using a modern Node.js installation. The test checks the shared survey, calibration example, all cluster candidates, PCA, feedback linkage, classifier metrics, threshold behavior, filter rendering, session review workflow, portfolio feasibility and constraint checks, spend forecast, supplier screening, governance gate outcomes, live portfolio linkage, coaching gaps, roadmap dependency cascades, scorecard missingness all six module views, landing and pathway visibility, executive tour sequencing, route parsing and direct executive/technical/leadership/experience entry, profile evidence links and skip-to-content navigation. This is not a real browser test.

## Validation before public deployment
- Review copy, source pages, and methodology; add a prominent portfolio disclaimer on every page.
- Test with desktop and mobile browsers, keyboard navigation, exported CSV, all filters and direct module links.
- Separate the shared CSS, dataset generation, and module code when migrating to a source repository.
- Add accessibility and automated regression tests before production deployment.
- Never use proprietary OLG records, branding implying affiliation, or sensitive gambling data for promotional targeting.

This independent demo does not represent OLG, and does not contain internal OLG data.
