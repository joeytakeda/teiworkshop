# lib/

Third-party files that the workshop pages load. They are committed and
copied into the site as they are, so pages never depend on a CDN.

| Folder | Version | Source | Used by |
|---|---|---|---|
| `reveal-4.0.2/` | 4.0.2 | reveal.js release | decks 2020-11-23 to 2023-11-08_2 |
| `reveal-5.0.4/` | 5.0.4 | reveal.js release | decks 2024-02-14, 2024-04-17, 2026-04-01 |
| `ace-1.4.1/` | 1.4.1 | npm `ace-builds@1.4.1`, `src-min/` (ace.js, mode-xml, theme-chrome, worker-xml) | editors in 2018-10-25, 2021-11-18, 2022-10-26 |
| `highlight.js-10.4.0/` | 10.4.0 | npm `@highlightjs/cdn-assets@10.4.0` (highlight.min.js); `styles/darcula.css` from the highlight.js 10.4.0 package | spectator demo |
| `normalize-8.0.1/` | 8.0.1 | npm `normalize.css@8.0.1` | spectator demo |
| `ceteicean/` | unknown (pre-1.0 build) | CETEIcean | editors in 2021-11-18, 2022-10-26 |
| `annotorious-2.5.10/` | 2.5.10 | Annotorious | 2021-11-18/annotate.html |
| `annotorious-shape-labels/` | unknown | Annotorious shape-labels plugin | 2021-11-18/annotate.html |
| `bootstrap-5.0.2/` | 5.0.2 | Bootstrap CSS | 2021-11-18/annotate.html |
| `fonts/oswald/` | variable | Google Fonts (OFL) | shared deck stylesheet |
| `fonts/*/` (others) | | npm `@fontsource/*` 5.x, woff2 files only, CSS rewritten to them; `fira-code/` from `@fontsource-variable/fira-code`, renamed to the `Fira Code VF` and `Fira Code` families the decks use | decks, spectator demo |

Each folder keeps its library's licence file where one was distributed.
