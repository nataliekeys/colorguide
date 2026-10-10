# Classification notes

The portfolio previously used an independent HSL demo classifier, not the course extension's code. Its orange/brown threshold labeled `#92866b` Orange. The course classifier also labeled this sample Orange. Both now share the same implementation.

The course code included `11 <= lightness < 90`, which JavaScript evaluates as a boolean compared to 90. Neutral rules also followed some hue rules, allowing overlapping classifications. The continuation uses explicit comparisons and checks neutrals first.

The new brown and olive regions use both hue and saturation/lightness. A new Olive family handles dark or muted yellow-green colors. A pale saturated hue is not forced into the neutral family solely because it is light. Thresholds remain hand-tuned and context-dependent; the tests encode intended behavior rather than a claim of universal color-name accuracy.

Sampling uses the most common label in the clipped neighborhood. Edge pixels no longer vote as transparent black. A tied vote prefers the center label when it participates in the tie. Strong edges and textured products may still need a different sampling strategy; a future comparison could evaluate center-weighted or perceptual clustering with users.

Before release, collect actual hex samples from troublesome shopping pages, record user-preferred names, and evaluate the changes with colorblind participants. Keep an independent set of examples for evaluation. Add regressions for approved naming decisions rather than simply matching the implementation.

## Ambiguous colors

`classifyRgb` and `classifyHexDetailed` return `{primary, secondary, confidence}`. Confidence is the fraction of 27 nearby RGB samples (each channel offset by -8, 0, or +8) retaining the primary name. It is a local stability heuristic, not calibrated accuracy. Below 0.80, the most common other name is offered. `formatLabel(result, false)` hides it. Both demos provide a checkbox; the extension shows alternatives automatically. Screenshot confidence also includes agreement across sampled pixels.

Pale warm neutrals have a Cream category. RGB (192,128,64) returns Brown / Orange; (245,240,230) returns Cream / White; (240,232,216) returns Cream. These are regression expectations, not new user-study results.
