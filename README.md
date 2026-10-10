# ColorGuide

A personal continuation of the ColorGuide Online Shopping Assistant course project. The Chrome extension adds persistent, plain-language color labels to a page.

## Origin and credit

Based on [Teaching-Accessibility/course-project-colorguide](https://github.com/Teaching-Accessibility/course-project-colorguide). Original collaborators: Kelley, Tin, and Natalie Keys. Kelley defined the original color dictionary; Tin implemented label interactions; Natalie implemented the dictionary, popup, and styling. The original Git history and [course documentation](docs/ORIGINAL-COURSE-README.md) are retained.

## Classification improvements

- A single classifier powers the extension and standalone demo.
- Neutral colors are handled before hue rules, correcting an invalid chained comparison and avoiding hue labels from tiny RGB differences.
- Muted warm colors receive brown/tan-family labels rather than automatically becoming orange. Olive tones have an explicit family.
- Five-by-five sampling clips to the screenshot edge, ignores transparent padding, and resolves ties using the clicked pixel.
- Screenshot coordinates use the captured image dimensions instead of assuming the browser’s device-pixel ratio matches the capture.
- Tests cover brown, olive, neutral, pastel, saturated, and dark samples, invalid inputs, grayscale continuity, and edge sampling.

These are deterministic naming heuristics. They have not yet been validated through a new user study. They describe screenshot pixels, not the physical color of an item. Boundaries will need further refinement against real shopping examples; see [classification notes](docs/CLASSIFICATION.md).

## Try it

Open `demo/index.html` to try colors without installing the extension. Start with `#92866b`, a muted brown regression sample resembling the reported mismatch. It is not an exact measured color from the screenshot.

To try the extension: open `chrome://extensions`, enable Developer mode, choose **Load unpacked**, and select this repository folder. Use the popup to toggle the selector; the original shortcuts and label interactions remain.

## Tests

Requires Node.js 18 or newer. No dependencies or install step:

```sh
npm test
```

## Project status

Private development continuation. Classification unit tests and demo checks do not constitute an end-to-end extension test. Verify capture, labels, zoom, high-DPI displays, and supported shopping pages in Chrome before release. The source archive contained no LICENSE file; this continuation does not add or replace licensing terms for the original collaborators’ work.
