# SignRR project page

Project page for **SignRR: Retrieve and Refine Real Motion for Sign Language Production** (BMVC 2026).

Site: https://omarftt.github.io/SignRR-page/

## Editing
- All page content is in `index.html`. The palette (blue, teal, amber) and the page components are in `static/css/signrr.css`.
- **Figures 1 and 2.** These are animated GIFs (`static/images/fig1_overview.gif`, `fig2_architecture.gif`). An amber box walks through the stages, with the step named in a strip under the figure. Visitors who turn off motion get the static PNG.
- **Comparison clips.** These live in `static/videos/comparison/<sequence>/<model>.mp4`: 480×600 px, H.264, one folder per PHOENIX14T test sequence. Each example tab in `index.html` names its folder (`data-seq`) and its sequence (`data-name`).
- **Tables.** These are crops of the paper tables. The amber outline on the SignRR row is a `.row-outline` element positioned in percent over the image.

## Preview locally
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000.

## Credits
This site is built from the [Academic Project Page Template](https://github.com/eliahuhorwitz/Academic-project-page-template) (original version), which was adapted from [Nerfies](https://nerfies.github.io).

The website is licensed under [CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/).
