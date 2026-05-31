# Weather Starter Themes

This document tracks the visual themes discussed for Weather Starter, including the short intent and key design considerations for each theme.

## Design Considerations Framework

Each theme is defined with these consistent visual dimensions:

- Color direction: Core palette, contrast model, and atmospheric background treatment.
- Typography: Primary and secondary type voices for headings, data, and body text.
- Card styling: Shape language, border/shadow treatment, and surface feel.
- Layout density: How tight or spacious the information rhythm should feel.

## Theme Catalog

| Theme | Description | Color Direction | Typography | Card Styling | Layout Density | Status |
| --- | --- | --- | --- | --- | --- | --- |
| apple | Existing baseline visual design preserved as default. | Cool blue atmospheric gradient with white text. | Lightweight modern sans look. | Soft glass cards with subtle blur. | Medium | Implemented |
| Sunprint Editorial | Warm, newspaper-inspired dashboard that feels trustworthy and human. | Parchment, ink black, rust, muted teal. | High-contrast serif headings + clean grotesk body. | Thin borders, paper-like surfaces, lower corner radius. | Medium-dense | Implemented |
| Nordic Air | Cool Scandinavian interface focused on clarity and whitespace. | Icy blues, fog gray, off-white, pine accents. | Geometric sans with wider tracking. | Soft radius cards, low-noise shadows, clean surfaces. | Spacious | Implemented |
| Storm Radar Pro | High-contrast, data-centric forecast console. | Charcoal base, electric cyan highlights, warning amber. | Condensed sans + mono data labels. | Sharp corners, layered panels, tactical contrast. | Dense | Implemented |
| Citrus Pop | Cheerful, energetic weather experience. | Tangerine, lemon, sky blue, cream. | Rounded display-forward sans treatment. | Chunkier rounded cards and bright surfaces. | Medium | Implemented |
| Moss and Mist | Nature-forward style centered on calm seasonal mood. | Moss green, stone gray, mist white, clay accents. | Humanist sans + soft serif accents. | Layered translucent cards, organic radii. | Medium-spacious | Implemented |
| Neon Night Transit | City-night theme inspired by transit signage. | Deep navy, neon lime, magenta accents, cool grays. | Narrow/condensed sans for signage feel. | Dark glass cards with sharper geometry and glow contrast. | Dense | Implemented |
| Coastal Postcard | Breezy travel-poster aesthetic. | Seafoam, coral, sand, sun-faded blue. | Expressive display serif + relaxed sans body. | Postcard-like framed cards with soft depth. | Spacious | Implemented |
| Terminal Isobar | Retro command-line weather board with modern readability. | Black and phosphor green with amber signal accents. | Monospace-first hierarchy. | Bordered modules, square corners, crisp edges. | Dense | Implemented |
| Alpine Signal | Crisp mountain-inspired UI with instrument clarity. | Snow white, slate, glacier blue, safety orange accents. | Sturdy grotesk + tabular metric emphasis. | Angular cards, strong dividers, compact structure. | Medium | Implemented |
| Desert Weather Bureau | Sunbaked modernist weather bureau language. | Terracotta, dune beige, cactus green, twilight tones. | Square technical sans + narrow metric voice. | Matte/beveled panel feel with tighter framing. | Medium-dense | Implemented |
| Aurora Glass | Luminous atmospheric interface with translucent layering. | Arctic mint/blue/rose gradients on deep backdrop. | Clean neo-grotesk with lighter weights. | Frosted glass cards, soft glow, higher blur. | Medium-spacious | Implemented |
| Metro Fold | Bold modular blocks inspired by transit maps. | Primary accents over graphite neutrals. | Heavy narrow sans headlines + compact details. | Flat modular tiles with strong outlines. | Dense-medium | Implemented |
| Ink Rain | Moody editorial look with dramatic contrast. | Ink navy, wet slate, silver, muted cool accents. | Elegant serif headings + neutral sans body. | Semi-opaque dark cards with fine borders. | Medium | Implemented |
| Playroom Forecast | Friendly, family-oriented weather UI. | Bubblegum/mint/sunflower/cloud tones. | Playful rounded display + simple sans body. | Pill-like cards, soft depth, approachable shapes. | Spacious-medium | Implemented |
| Brutalist Climate Board | Raw, unapologetic hierarchy-first visual language. | Black and white with hazard yellow and cobalt accents. | Heavy uppercase grotesk tone. | Hard-edged boxes, thick borders, no blur. | Dense | Implemented |
| Zen Observatory | Tranquil, low-noise interface tuned for focus. | Muted sage, warm gray, ivory, restrained blue accents. | Elegant light sans with generous breathing room. | Minimal cards with subtle outlines. | Spacious | Implemented |
| Vintage Instrument Panel | Retro aviation/marine dashboard character. | Brass, charcoal, ivory, oxidized teal. | Condensed technical sans + slab-serif heading flavor. | Inset panel feel with framed metric modules. | Medium-dense | Implemented |
| Candy Gradient Lab | Experimental, vivid, playful gradient exploration. | Saturated gradient pairs on neutral grounding surfaces. | Modern display sans + plain readable body sans. | Gradient borders, floating cards, soft blob accents. | Medium | Planned |

## Notes

- Themes are implemented through CSS variables and scoped overrides keyed by `data-theme` on the root element.
- Theme selection is persisted in local storage under `weather-starter.theme`.