# Beyond the Numbers — Customer Intelligence & Research Lab

Release 0.3: Executive Customer Insights Hub + Research Methodology Lab + Customer Segmentation Explorer. Open `index.html` in a modern browser; no installation, server, API key or internet connection is required (public source links do require internet). The website is a self-contained prototype for easy review and future migration into a modular repository.

## Roadmap
1. Executive insights hub — implemented: public scorecard, executive decision brief, synthetic study filters, Wilson intervals, cross-tabs, association analysis, CSV export, research recommendations and source register.
2. Research methodology — implemented: questionnaire split-ballot design, calibration and Kish effective sample size, cross-tabs, independent-wave z-test and fixed-mix tracking. Includes proposed research approval gates.
3. Customer segmentation — implemented: six 1–7 synthetic needs ratings, standardized K-means++ (k=2–6, five starts), sampled silhouette, holdout resampling ARI, PCA visualization, calculated profiles, CSV export and responsible-use safeguards.
4. Voice of Customer — synthetic interviews/comments, thematic coding, human validation, evidence triangulation.
5. Research portfolio & budget — intake, prioritization, allocation, vendor evaluation.
6. Leadership & governance — team capability, quality gates, stakeholder partnerships and 90-day plan.

## Data contract
`PUBLIC` contains historical aggregate measures from published annual reports. The synthetic `survey` array contains 2,400 independently generated observations across four fictional waves: id, wave, primary channel, four binary reported barriers, product and service satisfaction flags. Release 0.3 extends each record with `needs` (six integer 1–7 importance ratings; fixed order defined by `NEEDS`). This synthetic feature generator uses overlapping planted patterns, a separate deterministic seed and modest barrier-related shifts; it preserves all original survey outcomes. Satisfaction and channel are descriptive profiling outcomes, never clustering inputs. `MODULES` registers the six module views. Later modules should reuse this shared schema and distinguish public, synthetic and proposed evidence; expand it deliberately rather than treating the artificial observations as real customers. Do not compare simulation levels to actual OLG scores, or identify causal effects from the synthetic cross-tabs.

## Segmentation methodology (0.3)
- Full-sample exploratory K-means using standardized importance ratings; compare within-cluster sum of squares and sampled silhouette (320 fixed random records). The PCA projection uses two orthogonal components of the same standardized features.
- Stability is mean pairwise ARI of three models fit on 75% subsamples of the training pool, each with its own standardization, evaluated on a common 600-record holdout. This is internal resampling stability, not external validation.
- Suggested k maximizes sampled silhouette among candidates with ARI ≥ 0.65 and minimum share ≥ 5%. These are illustrative review gates, not validated industry standards. Near-ties and modest silhouette scores require substantive review; never infer real segments from planted synthetic structure.
- Use segment profiles only to formulate hypotheses about accessibility, service quality, information clarity and informed choice. No promotional targeting or individual risk inference.

## Local regression smoke test
Run `node tests/smoke.mjs` using a modern Node.js installation. The test checks the shared survey, calibration example, all cluster candidates, PCA, simulated DOM rendering and module navigation. This is not a real browser test.

## Validation before public deployment
- Review copy, source pages, and methodology; add a prominent portfolio disclaimer on every page.
- Test with desktop and mobile browsers, keyboard navigation, exported CSV, all filters and direct module links.
- Separate the shared CSS, dataset generation, and module code when migrating to a source repository.
- Add accessibility and automated regression tests before production deployment.
- Never use proprietary OLG records, branding implying affiliation, or sensitive gambling data for promotional targeting.

This independent demo does not represent OLG, and does not contain internal OLG data.
