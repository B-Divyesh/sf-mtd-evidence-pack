# Visual thesis — the paper moon ledger

## Direction and reason

The product uses surreal editorial scenery: a night-time filing landscape where quarterly records become lit paper windows, a paper moon, and neat paths. The scene turns an anxious compliance job into a finite place that can be surveyed. It feels recognisably British and administrative without using HMRC branding, official seals, or false authority.

The interface is not a generic dashboard. A narrow editorial masthead meets an asymmetric first screen. Fine rules, numbered field notes, clipped corners, paper grain, and indigo ink make the working area feel like a carefully assembled evidence folder.

## Palette

- `paper #F3EBD8`: warm document ground.
- `paper-light #FFF9EC`: raised sheets and fields.
- `ink #17233B`: primary text; 12.4:1 on paper.
- `ink-soft #4D5667`: secondary text; 6.4:1 on paper.
- `night #17233B`: deep editorial panels.
- `acid #D7F06A`: highlight and primary action; `#17233B` text is 11.2:1.
- `coral #E96855`: warnings and surreal sun detail; never the only status signal.
- `sage #28735A`: complete state; paired with words and symbols.
- `danger #A13D37`: errors; 5.9:1 on paper-light.

This is an explicitly light, paper-led product with night panels. A separate dark mode would weaken the paper-versus-night spatial idea, so every background is painted deliberately.

## Type

Display headings use Georgia, a self-hosted system serif with an editorial, printed character. Body copy uses the local system sans stack (`Inter`-like on common platforms) for forms and dense transaction tables. No font file or third-party font request is needed. Figures use tabular numerals.

Scale: 14, 16, 18, 24, 36, and a fluid 48–72px display. Body text never drops below 16px in task flows. Text measures stay under 70 characters.

## Spacing and shape

An 8px base grid uses 8, 16, 24, 32, 48, 64, and 96px gaps. Working sheets use 2px ink rules and a clipped top-right corner. Buttons are rectangular with slightly rounded 6px corners, a 3px offset shadow, and at least 44px height. The scene uses generous negative space; dense tables become stacked records at 720px.

## Interaction grammar

Primary actions look like labelled evidence tabs. Rows enter as a short stack of paper slips. Check items change with a small ink-stamp scale effect. Navigation moves focus to the new page heading and announces it. Errors use a red left rule, a short cause, and one next action. Saving shows a plain status line.

## Motion policy

The signature motion is a 420ms paper-rise: hero layers and newly imported records rise a few pixels into alignment. Interface feedback uses 160–220ms opacity and transform transitions. Nothing loops. Under `prefers-reduced-motion: reduce`, transforms and smooth scrolling are removed; state changes remain visible through text, borders, and opacity.

## Asset plan and provenance

- `hero-ledger.webp`: original landscape illustration generated for the first screen. A surreal paper moon lights four document houses across an indigo accounting landscape. No people, text, brands, insignia, or official symbols.
- `social-card.webp`: a 1200×630 crop composed from the same original art, with live HTML metadata supplying all readable words.
- Favicon: hand-authored SVG paper-moon mark. PWA icons are square crops of the original paper-moon scene, rasterised locally.

Prompt sheet: “Surreal editorial cut-paper landscape for a UK sole trader bookkeeping evidence tool; vast midnight indigo ground; four small cream paper filing houses arranged as quarterly waypoints; a pale chartreuse paper moon; one coral path connecting the documents; tactile torn paper fibres, subtle print grain, crisp studio collage lighting, restrained sophisticated magazine illustration, landscape framing, negative space at left, no people, no text, no numbers, no logos, no watermark, no government crests, no currency symbols.”

Generation: `/opt/fleet/lib/gen-image.sh`, factory image deployment, 28 August 2026. The generated artwork is original to this product. The selected source and exact prompt live in `assets/src/hero-ledger.json`. Final WebP files are locally optimised and remain below 300 KB.
