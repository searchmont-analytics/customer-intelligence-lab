# Beyond the Numbers — Customer Intelligence & Research Lab

Release 0.2: Executive Customer Insights Hub + Research Methodology Lab. Open `index.html` in a modern browser; no installation, server, API key or internet connection is required (public source links do require internet). The website is a self-contained prototype for easy review and future migration into a modular repository.

## Roadmap
1. Executive insights hub — implemented: public scorecard, executive decision brief, synthetic study filters, Wilson intervals, cross-tabs, association analysis, CSV export, research recommendations and source register.
2. Research methodology — implemented: questionnaire split-ballot design, calibration and Kish effective sample size, cross-tabs, independent-wave z-test and fixed-mix tracking. Includes proposed research approval gates.
3. Customer segmentation — needs-based clusters, stability, interpretation, responsible-use safeguards.
4. Voice of Customer — synthetic interviews/comments, thematic coding, human validation, evidence triangulation.
5. Research portfolio & budget — intake, prioritization, allocation, vendor evaluation.
6. Leadership & governance — team capability, quality gates, stakeholder partnerships and 90-day plan.

## Data contract
`PUBLIC` contains historical aggregate measures from published annual reports. The synthetic `survey` array contains 2,400 independently generated observations across four fictional waves: id, wave, primary channel, four binary reported barriers, product and service satisfaction flags. `MODULES` registers the six module views. Later modules should reuse this shared schema and distinguish public, synthetic and proposed evidence; expand it deliberately rather than treating the artificial observations as real customers. Do not compare simulation levels to actual OLG scores, or identify causal effects from the synthetic cross-tabs.

## Validation before public deployment
- Review copy, source pages, and methodology; add a prominent portfolio disclaimer on every page.
- Test with desktop and mobile browsers, keyboard navigation, exported CSV, all filters and direct module links.
- Separate the shared CSS, dataset generation, and module code when migrating to a source repository.
- Add accessibility and automated regression tests before production deployment.
- Never use proprietary OLG records, branding implying affiliation, or sensitive gambling data for promotional targeting.

This independent demo does not represent OLG, and does not contain internal OLG data.
