# Beyond the Screen — Clickable HTML Prototype: Build Instructions for Claude Code

## Before you start: attach the reference screenshots
This spec describes the reference screenshots in words, but Claude Code can see images directly. **Save the 6 original reference screenshots (AXS event page, Hinge splash, "What's your name?", "Pick Prompts," "Ready to connect," "Standouts," and "Friend's Take") into a `reference/` folder next to this file, and look at them directly before building each corresponding screen.** Treat this document as the spec for *what changed* from each reference screen — treat the actual screenshot as the source of truth for anything visual this doc doesn't pin down precisely (exact photo crops, precise spacing, icon shapes, etc.).

## Goal
Build a static, clickable, mobile-frame HTML prototype simulating the "Beyond the Screen" never-user flow: a user goes from an AXS ticket page, through a Hinge banner CTA, expedited onboarding, a pre-event teaser, and into a live event discovery experience for a fictional concert ("The Strokes at Citi Field"). No backend, no real data — pure front-end click-through demo for stakeholder review.

## Tech approach
- Plain HTML/CSS/JS. No build step, no frameworks — must open directly in a browser or run via a trivial local server.
- Single `index.html` is fine, or split into `index.html` + `styles.css` + `script.js` — either is acceptable, but keep it to those three files (no bundlers, no npm dependencies).
- All 9 screens live inside one phone-frame mockup (rounded rectangle, ~375–414px wide, notch/status-bar treatment at top) centered on a neutral page background, matching the framing style seen in the reference screenshots (device frame with drop shadow on a light gray page background).
- Navigation: tapping the primary CTA button/pill on each screen advances to the next screen in sequence. **Screen 0 is the true entry point / default landing screen of the whole demo now** (updated — was Screen 1). Include a small "Restart demo" control (e.g., a subtle button in a corner outside the phone frame) to reset back to Screen 0.
- **Back button (required on every screen except Screen 0):** Every screen except Screen 0 must show a back chevron ("‹") in the top-left corner of the phone frame, returning to whichever screen actually precedes it given the real navigation graph (not strictly `currentScreen - 1`, since Screens 1a, 1b, 1c, and 8a exist as insertions — e.g., Screen 1a's back returns to Screen 1, Screen 8a's back returns to Screen 8, **Screen 1's back returns to Screen 0**). Screen 0 has no back button since it's the entry point. Where a screen's own reference design already includes a back chevron in this position (e.g., Screen 4), reuse that same element rather than adding a second one.
- **The flow is strictly sequential, no loops:** Screen 0 → Screen 1 → Screen 1a → Screen 1b → Screen 1c → Screen 2 → ... → Screen 9. There is no link or toggle on Screen 1 pointing back to Screen 0 mid-flow — the only way back to Screen 0 is the back chevron, and the only way forward is each screen's own CTA. Don't build any side-branch access point between 0 and 1.
- Screens are implemented as stacked `<div>` "screens" toggled via a simple JS state variable (e.g., `currentScreen`), not real routing/URLs.
- Status bar (time, signal, wifi, battery icons) should be a simple static SVG/text mock at the top of each phone-frame screen — doesn't need to be dynamic/real time.

## Image asset system (so real photos can be dropped in later)
Create an `/images` folder next to `index.html`. Every photographic element in the prototype must reference a named file in that folder via a plain `<img src="images/FILENAME">` — never inline base64, never a hotlinked external URL. Until real assets are provided, generate simple placeholder images (solid-color background + centered label text, correct aspect ratio) and save them under these exact filenames so a user can later drop in a real photo with the same filename and same aspect ratio to instantly upgrade the visual:

| Filename | Used on | Aspect ratio / notes |
|---|---|---|
| `images/axs-map.jpg` | Screen 1 (AXS venue map tile) | ~4:3, map-style placeholder |
| `reference/screen-2-exact.png` | Screen 2 — exact exported Figma design, used directly as the whole screen (see Screen 2 spec above). Not a placeholder, not swappable via the images/ convention — this file must exist before Screen 2 can be built correctly. | Full phone-frame portrait |
| `images/friends-take-bg.jpg` | Screen 9 (event-over interstitial background photo) | Full phone-frame portrait, ~9:19.5 |
| `images/profile-1.jpg` through `images/profile-6.jpg` | Screens 6 & 8 (discovery grid / carousel cards) | Portrait ~4:5. Required: exactly one file per carousel card, 4–6 cards total (see Screen 8 spec). Screen 6 reuses the same 4–6 files with a blur filter applied in CSS, not separate blurred image files. |
| `images/user-upload-placeholder.jpg` | Screen 4 ("Upload a photo" pill preview state, optional) | Portrait ~4:5 |
| `images/wristband-qr.jpg` | Screen 1a (physical QR touchpoint background — real photo, not a placeholder) | Full phone-frame portrait, `object-fit: cover` |
| `reference/appstore-hinge-real.png` | Screen 1b — used directly as the whole screen (same pattern as Screen 2's `screen-2-exact.png`) | Full phone-frame portrait |
| `reference/citi-field-map.png` | Source for Screen 1's map tile — crop into `images/axs-map.jpg` | N/A (source for cropping) |

Add a short `images/README.md` noting: "Replace any file in this folder with a real photo of the same filename and aspect ratio to update the prototype's imagery. No code changes required."

## Global style notes (derived from reference screenshots)
- **Fonts — three-way mapping, applied literally across all 9 screens:** Pull the exact fonts from the Figma nodes for Screens 2 and 3 (node 19828-30649 and node 19828-30654) via Figma MCP. Those nodes contain three distinct text roles — identify each one specifically and apply it by role, everywhere, on every screen:
  1. **Header font** (whatever font Figma uses on the node's main headline/title text) → use this exact font, weight, and size for every headline/title on all 9 screens (e.g. "Tell us the basics," "Show a little more of who you are," "Ready to connect with someone new?," "The Strokes at Citi Field," etc.).
  2. **Sub-text font** (whatever font Figma uses on the node's secondary/description/helper text) → use this exact font, weight, and size for every subtext/body/helper line on all 9 screens (input labels, descriptions, legal text, prompt answer text, etc.).
  3. **Pill font** (whatever font Figma uses on the node's button/pill label text) → use this exact font, weight, and size for every button/pill label on all 9 screens ("Continue," "Create account," "Let's go," "See who's out there," etc.).
  Do not apply one flat font to the whole prototype — headers, sub-text, and pills each get their own font per the mapping above, taken directly from what Figma actually returns for each role. This replaces all earlier font instructions ("Fraunces" placeholder, and the prior "read the fonts" instruction) — this three-way mapping is the final spec.
- **Hinge-branded screens** (2, 3, 4, 5, 9): warm off-white/cream background (`#F3F1EC`-ish) for onboarding/interstitial screens. Primary CTA buttons are full-black rounded pill buttons with white text (`border-radius: 999px`, `background: #111`, `color: #fff`). Secondary/text-only actions (e.g., "Sign in") are plain black text, no button chrome.
- **Discovery-grid screens (6, 8) use a different header weight/style than the rest of the app:** the "Standouts"/"The Strokes at Citi Field" header is bold, same font family as everything else per the note above, just a heavier weight than the onboarding headlines — not necessarily a different family anymore now that we're using one real font throughout. Confirm the exact weight against the Figma nodes if the header weight isn't otherwise specified there.
- **AXS screen** (Screen 1): dark navy background (`#0B1330`-ish), white/light-gray text, a blue accent color (`#3B82F6`-ish) for interactive text and highlighted UI blocks (tab underline, "Flushing Meadows Corona Park" panel), consistent with a native iOS dark-mode ticketing app.
- Input fields (Screen 3): white rounded rectangle boxes with a small gray label above the placeholder text, consistent corner radius (~12–16px), stacked vertically with consistent spacing.
- Card/prompt boxes (Screens 4, 6, 8): white rounded rectangle cards (~20–24px corner radius) with soft drop shadow, consistent with the "Pick Prompt" and "Standouts" card styling in the references.
- Bottom nav bar (Screens 6 & 8): dark/black bar with 5 icon slots (Home/H, Star, Likes with a numeric badge, Chat bubble with a numeric badge, Profile avatar). Only needed on the discovery-grid-style screens. Use "Likes" consistently as the label for that third icon throughout this doc (the reference screenshot calls it "Roses" — same icon slot, just renamed for this prototype).
- Status bar icon color must adapt per screen: light/white icons on dark backgrounds (Screen 1 only), dark/black icons on cream or photo-with-overlay backgrounds (all other screens) — don't hardcode one icon color globally.
- Mobile input handling (Screen 3): do not build a custom on-screen keyboard graphic. Use real `<input>` elements — the OS/browser will show its own native keyboard when a field is focused. If demoed on desktop, it's fine for no keyboard to appear at all.
- Add `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">` to prevent unwanted mobile zoom/scaling during the demo.

## Detailed visual design tokens (for higher visual fidelity)
These are close visual approximations read directly off the reference screenshots — not exact extracted pixel values, since the source is a photo/screenshot, not design files. Use these as the default; if a real screenshot and this spec ever conflict, the screenshot wins.

**Color palette**
- Cream background (Hinge screens): `#F4F1EA`
- Near-black text / primary buttons: `#141414`
- Secondary/helper text (gray): `#6E6E6E`
- Input box background: `#FFFFFF` on cream page (very subtle contrast, near-white, no visible border — rely on the page's cream tone for separation)
- AXS navy background: `#0B1330`
- AXS secondary panel navy (pills, "Doors Open," venue panel): `#18234A`
- AXS body text (light blue-gray): `#C7CEDD`
- AXS blue accent (tabs, links): `#3B82F6`
- Bottom nav bar background: `#111111`
- Bottom nav badge (notification count): `#8B5CF6` (purple) with white text

**Typography scale** (base assumes a 375–414px wide phone frame)
- Serif display headline (Screens 2, 3, 4, 5, 9): 30–34px, line-height ~1.15, `font-weight: 500–600`
- Bold sans header (Screens 6, 8 section titles): 22–24px, `font-weight: 700`
- Body/secondary text: 14–15px, `font-weight: 400`, color `#6E6E6E`
- Input labels: 12px, `#8A8A8A`, uppercase not required (reference uses sentence case)
- Button label text: 16px, `font-weight: 600`, white on black pills

**Spacing & shape**
- Page horizontal padding (Hinge screens): 24px from each edge
- Primary pill button: full width minus page padding, height 56px, `border-radius: 999px`
- Input box: `border-radius: 14px`, internal padding 16px, ~8px gap between stacked label and text, 12px vertical gap between stacked input boxes
- Prompt/photo cards (Screen 4): `border-radius: 24px`, ~16px gap between stacked cards, generous internal padding (~24px) around the centered pill
- Discovery-grid cards (Screens 6, 8): `border-radius: 24px`, card fills ~85% of frame width, ~12–16px gap between cards, adjacent cards peek ~8–10% on each side
- Card name overlay (Screens 6, 8): bold white text, top-left inset ~16px from card edges, sits over a dark linear gradient scrim (`rgba(0,0,0,0) to rgba(0,0,0,0.55)`) fading from card top to roughly 40% down, ensuring legibility over any photo
- Card prompt box (Screens 6, 8): white rounded rectangle inset near the bottom of the card (not full-width — matches reference's card-within-card look), `border-radius: 16px`, ~16px internal padding, label in gray 12–13px above a bold black answer at ~18–20px
- Card shadow (all rounded cards): soft, `box-shadow: 0 4px 20px rgba(0,0,0,0.08)`
- Bottom nav bar: fixed height ~64–72px, 5 icons evenly spaced, active icon (H) rendered solid/filled white, inactive icons rendered as thin white/gray outlines at reduced opacity (~60%)

## Screen-by-screen spec

### Screen 0 — CRM email touchpoint (NEW — this is now the true entry point / first screen of the whole demo)
This is the first acquisition touchpoint in a strictly sequential tour of channels — the same "meet someone at the show" hook, delivered via a marketing email. **This is the default landing screen when the prototype loads, and the whole flow is now linear from here: Screen 0 → Screen 1 → Screen 1a → Screen 1b → Screen 1c → Screen 2 → ... → Screen 9. No loops, no side-links between screens — every screen has exactly one forward CTA and (except Screen 0 itself) one back chevron to whatever precedes it.**

Base layout: use `reference/bowery-vip-email.png` (a real Bowery Presents "Your Exclusive Offer For The Strokes!" VIP upgrade email) as the visual base — recreate it as an actual scrollable email view (inbox header, archive/trash/mail/more icons, sender "The Bowery Presents" with avatar, subject line, the Bowery Presents banner image, then the offer content). Changes from the email as shown:
- Change the white banner text from "YOUR EXCLUSIVE VIP UPGRADE OFFER" to **"Ready to meet someone new?"**
- Below that, where the email's VIP offer body copy currently sits, change the body text to: **"Download Hinge now to see who's going to the concert"**. Use the same `images/hinge-h-icon.png` icon next to or near this line (see Screen 1 below for the same icon usage), and bold the phrase **"Download Hinge now"** within that sentence.
- Keep the rest of the email chrome (subject line, sender, the poster image block, Reply/Forward bar at the bottom) as visual dressing — non-functional except the one CTA described below.
- Make the "Ready to meet someone new?" banner block (or a distinct pill/button near it) tappable.
- No back chevron on this screen — it's the entry point.
- **UPDATED — remove the yellow highlight:** the original email screenshot has a yellow highlight/marker effect behind "The" and "Strokes" in the subject line. Remove that yellow highlighting entirely — plain subject line text, no highlight styling.

**Interaction: UPDATED — tapping anywhere on this screen advances to Screen 1** (not just the CTA specifically — the whole screen is a tap target now, since this is one of the first four touchpoint-tour screens where click-anywhere applies).

### Screen 1 — AXS event page with Hinge banner
Base layout: dark navy AXS "Event Info" screen for "The Strokes - Admissions," Flushing Meadows Corona Park, Corona, NY. Top bar: back chevron, event title + venue subtitle, info icon. Tabs: "Tickets (2)" / "Event Info" (Event Info active, blue underline). Body, top to bottom:
1. "Event Details" header
2. "Doors Open @ 3:00 PM" pill (clock icon)
3. Body paragraph: "As part of The Bowery Presents' ongoing commitment to the communities its events call home, a portion of ticket revenue from the show will be donated to the Alliance for..." with a "See More" link (truncated text is fine as static copy).
4. **New banner (insert here, between body paragraph and Venue Details):** A distinct highlighted panel/card with the copy: **"Want to meet someone who loves The Strokes as much as you? "** followed by **bold text "Download Hinge Now"** (bold only that phrase, not the full sentence). Style it as a clearly tappable card: lighter navy/blue background block, rounded corners, with the real `images/hinge-h-icon.png` icon (not a generic placeholder mark) placed to the left of the copy, so it visually reads as a partner integration, not native AXS content.
5. "Venue Details" header
6. "Flushing Meadows Corona Park" panel (chevron)
7. Map image — **UPDATED**: use `reference/citi-field-map.png` (a real Apple Maps screenshot showing Citi Field / Flushing Meadows Corona Park) as the source; crop it as needed to fit the small map tile area on this screen, and save the cropped result as `images/axs-map.jpg` (replacing the old placeholder). Keep the "Apple Maps / Legal" caption.
8. "Directions" + address block
9. "Check out venue policies here." footer bar (shield icon)

This screen's existing back chevron (in the AXS top bar, part of the original reference) now becomes functional: tapping it returns to Screen 0.

**Interaction: UPDATED — tapping anywhere on this screen advances to Screen 1a** (not just the Hinge banner specifically). The back chevron (top-left) still functions as a distinct control returning to Screen 0 — it should take precedence over the whole-screen tap zone, not trigger the advance.

### Screen 1a — Physical QR touchpoint: festival wristband QR code (NEW) — REPLACES the earlier "Shake Shack counter" concept entirely
**This screen's concept has changed — ignore any earlier "Shake Shack counter/napkin" instructions.** It now uses a real photo: `images/wristband-qr.jpg`, showing a concertgoer's wrist at a live show (colorful festival wristbands/bracelets, with a QR code visible on one wristband/watch face), stage lighting visible in the background — this photo already makes the "at the concert" context clear on its own, so the "📍 The Strokes — Citi Field" caption badge is no longer needed. This is the third acquisition touchpoint in the tour (after email and the ticket-app banner) and reads as the user glancing down at their own wristband QR code at the show.

**Visual composition:**
- Full-bleed background: `images/wristband-qr.jpg`, covering the entire phone frame (`object-fit: cover`, no letterboxing).
- **The classic iOS QR-scan recognition treatment:** render the iOS Camera app's yellow/gold corner-bracket viewfinder outline (four short corner brackets, no full box) positioned directly over the QR code visible on the wristband/watch in the photo, indicating it's been detected. Recreate this visually (four L-shaped corner marks in the iOS yellow/gold accent color).
- Below or near the QR code, add a small tappable link/label indicating this leads to a download (e.g., a small pill or text reading "Download Hinge") so the tap target and its purpose are clear, styled to sit naturally over the photo (dark scrim behind it if needed for legibility).

**Interaction: UPDATED — tapping anywhere on this screen advances to Screen 1b** (not just the corner-bracket outline specifically). Back chevron (returns to Screen 1) still takes precedence over the whole-screen tap zone.

### Screen 1b — App Store product page for Hinge (NEW) — UPDATED: use the real screenshot as the exact base, no animation
**Revert to using a real screenshot as the exact visual base**, rather than a custom-built mockup: use `reference/appstore-hinge-real.png` (an actual iOS App Store product page for "Hinge Dating App: Match & Date") as this screen's content, rendered as a single image filling the screen (same technique as Screen 2 — see that screen's spec above for the pattern: full-bleed image, invisible tappable hotspot on top of the relevant button, no rebuilding the UI from scratch in HTML/CSS).
- Position an invisible tappable hotspot over the cloud-download icon / GET button area shown in the screenshot.
- **No animation on this screen** — the download icon should be static, matching the screenshot exactly. Remove any pulse/bounce/loading animation that may have been added to this screen previously.

**Interaction: UPDATED — tapping anywhere on this screen advances to Screen 1c** (not just the hotspot over the download icon specifically — the invisible hotspot can be removed/widened to cover the full screen). Back chevron (returns to Screen 1a) still takes precedence.

### Screen 1c — Installing (NEW, brief transitional step)
A brief simulated install screen: the Hinge app icon with a circular progress ring animating around it (or a simple progress bar beneath the icon) and small text like "Installing Hinge…" This should auto-advance to Screen 2 after the progress completes (a couple seconds), or optionally show an "Open" button once "installed" that the user can tap to proceed — implementer's choice, but it must land on Screen 2 either way.

**Interaction:** Auto-advances (or via an "Open" tap) to Screen 2.

### Screen 2 — Create account (Hinge splash) — USE EXACT DESIGN, DO NOT REBUILD WITH CSS
This screen has an exact source file: `reference/screen-2-exact.png`, exported directly from the real Figma design (OBR Design Refresh Phase 1 file). **Do not recreate this screen's visuals with HTML/CSS elements.** Instead:
1. Render `reference/screen-2-exact.png` as a single full-bleed image filling the entire phone-frame content area for this screen (it should already be sized/cropped to a phone screen — scale it to fit the frame, don't crop further).
2. Overlay a transparent, invisible `<button>` or clickable `<div>` positioned over the "Create account" button area of the image (approximate position: full-width, bottom third of the screen where the pill button appears in the image). Tapping this invisible hotspot advances to Screen 3 — same interaction as every other screen's primary CTA.
3. No other element on this screen needs a hotspot ("Sign in" stays non-functional, as does the legal text).
4. This screen does NOT use `images/hinge-splash-bg.jpg` — ignore that entry in the asset table below for Screen 2 specifically; that placeholder file can stay unused/removed since the exact image replaces it entirely.

**Interaction:** Tapping the invisible hotspot over "Create account" advances to Screen 3.

### Screen 3 — "Tell us the basics" — USE FIGMA NODE AS DESIGN BASE
This screen has an exact source design in Figma: node `19828-30654` at https://www.figma.com/design/yyh6mIvrQkt6H6vdpjLEHy/%F0%9F%94%AE-OBR--Design-Refresh--Phase-1-?node-id=19828-30654&t=M02yi2LCkmUfl4bL-4 (same file as Screen 2's node). Use your Figma MCP tools to fetch this node and use it as the visual and structural base for this screen — its exact layout, colors, typography, spacing, input box styling, and button styling should carry over directly, the same way Screen 2 was rebuilt from its Figma node. Export any real image/icon assets referenced in that node into `/images` as needed.

On top of that Figma base, apply these content changes (these are the only differences from the Figma node — everything else about the node's design should be used as-is):
1. Headline text: change to **"Tell us the basics"**.
2. Remove the descriptive subtext/blurb below the headline entirely (the Figma node's equivalent of "Hinge doesn't verify names... " text) — no replacement text needed.
3. Fields, in order: "First name" (keep as in the Figma node), "Age" (replaces whatever the node's second field is, e.g. "Last name"), then two new fields below matching the same input box style from the node: "Gender" and "Sexuality". All four fields are plain free-text inputs for this prototype — no dropdown/picker logic, no validation needed.
4. Remove any "Why is this optional?" or similar helper link tied to the old second field, since it no longer applies once that field becomes "Age."
5. Keep the primary button styling from the Figma node, with label **"Continue"**.
6. Keep the back chevron from the Figma node in the top-left (this satisfies the global back-button requirement — don't add a second one).

**Interaction:** Tapping "Continue" advances to Screen 4. (Fields do not need validation — button is always tappable.)

### Screen 4 — "Show a little more of who you are"
Cream background, top bar with back chevron (left) and "Skip" pill (right, non-functional). Headline: **"Show a little more of who you are"** (serif, matches reference sizing/wrap). Subtext — **UPDATED, replaces the earlier "keep as-is" instruction**: **"Add a photo and what you're excited for tonight to help people get to know you."** Below that:
1. **Large square card** (bigger than the other prompt cards below it), same white-rounded-card style, with a large black pill button centered inside reading **"Upload a photo"**. Tapping it swaps in `images/user-upload-placeholder.jpg` (or a real photo if provided) as the card's photo, filling the card. **Once a photo has been added, the "Upload a photo" pill button must disappear entirely** — the card just shows the photo with no pill overlaid on top of it. (This is required now, not optional — update from the earlier "nice-to-have" note.)
2. One prompt-style card below it (same size/style as the reference's smaller prompt boxes) with a black pill inside reading **"Your favorite Strokes song"**.
3. **Input focus style fix:** wherever there's a text input or editable field on this screen (e.g., if tapping the prompt pill opens a text entry for the answer), remove the default blue focus outline/highlight that appears when typing. Use the same neutral gray treatment as the rest of the input styling (per the Screen 3 input box tokens) instead — no blue anywhere on focus/typing states.

Do not include the second and third empty "Pick Prompt" boxes from the original reference — only the one photo-upload card and one prompt card are needed here.

**Interaction:** No explicit "Continue" button shown in the reference for this screen — add a full-width black pill "Continue" fixed near the bottom (consistent with the rest of the flow) that advances to Screen 5.

### Screen 5 — "Ready to connect with someone new?"
Cream/off-white gradient background, vertically centered serif headline: **"Ready to connect with someone new?"**. Below the headline, add subtext (new): **"We'll give you a preview of who you could meet at the concert."** Near the bottom, full-width black pill button: **"See who's out there"**.

**Interaction:** Tapping the pill advances to Screen 6.

### Screen 6 — Blurred pre-event teaser grid ("The Strokes at Citi Field") — UPDATED SPEC, now independent of Screen 8
Screen 6 no longer reuses Screen 8's cards — it has its own distinct set of profiles, described below. It still shares Screen 8's general structural layout (header, card carousel, bottom nav), but content differs.

**Bottom nav — use exact Figma reference:** Fetch Figma node `19419-28836` from the Hinge Spec File 2.0 file (https://www.figma.com/design/OAv1phJNLmZttNYSSKgrTx/Hinge-Spec-File-2.0?node-id=19419-28836) via Figma MCP and use its bottom nav bar design exactly (icon set, spacing, colors) in place of the previously-approximated nav bar. The icon representing whichever screen the user is currently on must be highlighted in white/filled (for both Screen 6 and Screen 8, that's the Home/H icon, since both are discovery-type screens). This same exact nav component should also be used on Screen 8 (see below) — build it once, reuse it on both screens.

**Overall type/style alignment:** Beyond just the nav bar, align this screen's fonts and general visual style with the same Figma node (`19419-28836`) — headline weight/size, card text styling, spacing should follow that reference, not just the nav component in isolation.

Content for this screen:
- Header: **"See Who's Going to The Strokes"** (replacing the earlier "The Strokes at Citi Field" title — this title change applies to Screen 6 only; Screen 8 keeps "The Strokes at Citi Field").
- **4 profile cards**, scrollable — the user should be able to scroll/swipe through all 4, and tapping near the edge of the next (partially peeking) card should trigger a carousel animation that slides that card into full focus, not an instant jump. Use these exact names and photos:
  1. **Ryan** — `images/profile-ryan.png`, prompt answer: "Last Nite, it's a jam"
  2. **Mark** — `images/profile-mark.png`, prompt answer: "I'm here for the openers"
  3. **Kiran** — `images/profile-kiran.png`, prompt answer: "TV on the Radio, supremely underrated"
  4. **John** — `images/profile-john.png`, prompt answer: "The vibes"
- Prompt label on every card: **"What are you most excited for tonight?"**
- All profile photos rendered with a CSS blur filter (`filter: blur(16px)` as a starting value — adjust as needed so the person underneath is clearly unrecognizable, but the general shape/color of the photo is still visible). Name and prompt label/answer text remain fully legible/unblurred. No age shown on cards.
- **Heart icon, not rose:** Fetch Figma node `19419-28939` (https://www.figma.com/design/OAv1phJNLmZttNYSSKgrTx/Hinge-Spec-File-2.0?node-id=19419-28939) via Figma MCP and use its heart icon exactly, placed in the bottom-right corner of each profile card (the same position the rose icon occupied in the original Standouts reference). **Position it slightly further up and inward from the corner than a literal edge placement** — nudge it in from both edges rather than flush against the corner. This heart icon is specific to Screen 6 only — Screen 8 keeps that corner icon removed entirely, per its own spec below (this creates an intentional difference between the two screens; flag to the user if that seems off, but it's what was specified).
- No rose icon or rose-count pill in the header area (top-right) — stays removed, same as Screen 8.

This communicates "people are already opted in" before the event goes live.

**Interaction:** Add a fixed, visible black pill button pinned near the bottom of the screen, copy: **"Continue"**. Tapping it advances to Screen 7. (Decided: use an explicit button here, not a whole-screen tap — keeps the interaction obvious for a demo audience.)

### Screen 7 — "Concert has started" interstitial — UPDATED AGAIN: use the tighter poster crop from the email, repositioned text
Use the poster artwork as it appears in `reference/bowery-vip-email.png` (the tighter-cropped version — "THE STROKES / Reality Awaits / NEW YORK / October 2nd, 2026" with "with BEACH HOUSE / TV ON THE RADIO and FCUKERS / FLUSHING MEADOWS CORONA PARK" below it) rather than the full separate poster file. Crop/export just that poster block from the email screenshot into `/images` (e.g. `images/strokes-poster-crop.png`) and use it as this screen's full-bleed background. **UPDATED — the photo must cover the entire phone-frame screen edge-to-edge** (use `object-fit: cover` or equivalent, not `contain` — no letterboxing, no empty margins around the image; it should fill the full screen exactly like the other full-bleed photo screens). Text and the pill button are overlaid directly on top of the photo (with a dark gradient scrim so they stay legible), not next to or below it.

Headline: **"The concert has started!"** Subtext: **"Get ready to meet someone new."** — **reposition this text down so it sits directly above the "Reveal who's here" pill button** at the bottom of the screen, rather than centered on the image. Bottom pill button, exact copy: **"Reveal who's here"**.

**Interaction:** Tapping the pill advances to Screen 8.

### Screen 8 — Discovery grid (full reveal)
Base layout: Hinge "Standouts"-style card carousel screen. Changes from the reference:
1. Section header "Standouts" → **"The Strokes at Citi Field"**.
2. Remove the rose icon and the "Roses (1)" pill entirely from the top-right of the header row.
3. **UPDATED — reverses an earlier decision:** Screen 8's cards now DO get a heart icon in the bottom-right corner, same as Screen 6 (this replaces the earlier instruction to leave that corner empty on Screen 8). Use the same heart icon sourced from Figma node `19419-28939` (Hinge Spec File 2.0). This icon is now interactive — see the "Send a Like" flow below.
4. Prompt label on the card: **"My favorite Strokes song"**; answer text: **"Last Nite, it's a jam"** (replacing "Biggest risk I've taken" / hurricane copy).
5. Build a real carousel of **4 profile cards** (partial peek of adjacent cards left/right, matching the reference's carousel behavior, with the same edge-tap-to-advance carousel animation specified for Screen 6). Use the same 4 named profiles as Screen 6, with their real photos (not blurred here). **UPDATED — Screen 8's prompt now matches Screen 6's exactly, both label and answers (this replaces "My favorite Strokes song" entirely — that prompt/answer set is retired):** Prompt label on every card: **"What are you most excited for tonight?"**
   1. **Ryan** — `images/profile-ryan.png` — answer: "Last Nite, it's a jam"
   2. **Mark** — `images/profile-mark.png` — answer: "I'm here for the openers"
   3. **Kiran** — `images/profile-kiran.png` — answer: "TV on the Radio, supremely underrated"
   4. **John** — `images/profile-john.png` — answer: "The vibes"
6. Bottom nav bar: use the same exact Figma-sourced nav component built for Screen 6 (node `19419-28836`, Hinge Spec File 2.0) — reuse it here rather than rebuilding. **The H (home) icon must be visually highlighted/white-filled** (instead of the star, which was active in the reference).

**Interaction:** Add a fixed, visible black pill button pinned near the bottom of the screen, copy: **"End of night"**. Tapping it advances to Screen 9. (Decided: use an explicit button here, not a card tap — consistent with the Screen 6 pattern above.) Tapping the heart icon on any card instead opens the new "Send a Like" screen (below), pre-populated with that specific card's profile — this does not advance the main flow, it's a sub-screen you return from.

### Screen 8a — "Send a Like" (NEW — triggered from Screen 8's heart icon, not part of the main numbered flow) — UPDATED: overlay, not a separate full screen
Fetch Figma node `15207-96724` from the Hinge Spec File 2.0 file (https://www.figma.com/design/OAv1phJNLmZttNYSSKgrTx/Hinge-Spec-File-2.0?node-id=15207-96724) via Figma MCP and use it as the exact visual and structural base for this screen — look closely at that node's actual composition (don't guess) and match it closely, including how it overlaps the profile beneath it.

**Key correction from the earlier version:** this should NOT be a full opaque screen that replaces Screen 8. It should render as an **overlap/overlay on top of the profile card** — the tapped profile's card (or its photo) stays visible behind/around the like-sending UI, consistent with how the Figma node composes it (a like/comment panel overlapping the profile rather than fully covering the screen). Rebuild this to match that Figma node's actual layered/overlapping composition, not a plain full-screen takeover.

This screen must be dynamic based on which profile's heart was tapped on Screen 8:
- Name shown = the tapped card's name (Ryan / Mark / Kiran / John)
- Prompt title shown = "What are you most excited for tonight?" (updated to match Screen 6/8's shared prompt)
- **Prompt answer shown = that specific profile's own answer from the Screen 8 card data — Ryan: "Last Nite, it's a jam" / Mark: "I'm here for the openers" / Kiran: "TV on the Radio, supremely underrated" / John: "The vibes". Do not hardcode one answer for all profiles — pull it from the same per-profile data used on Screen 8 (this was a bug — fix it).**
- Photo shown = that same profile's photo (images/profile-ryan.png, etc.), visible as part of the overlap composition per the Figma node
- **New requirement:** when the heart is tapped and this overlay appears, the overlay's content (photo, prompt, like/comment UI) should be positioned centered on the page/screen, not off to one side or anchored to wherever the tapped card happened to be.

**Interaction:** This screen's primary action (whatever the Figma node's main button says, e.g. "Send Like") returns the user to Screen 8. A back/close control also returns to Screen 8 without sending anything.

### Screen 9 — Event-over interstitial — UPDATED: new background from Figma
Background changes from `images/friends-take-bg.jpg` to a new source: fetch Figma node `19828-30661` from the OBR Design Refresh Phase 1 file (https://www.figma.com/design/yyh6mIvrQkt6H6vdpjLEHy/%F0%9F%94%AE-OBR--Design-Refresh--Phase-1-?node-id=19828-30661) via Figma MCP and use its background image/design as this screen's full-bleed photo, exported into `/images` (e.g. `images/screen-9-bg.png`). **Make sure the text overlay is correct** — same requirement as the Screen 2 fix earlier in this doc: the headline, subtext, and button must sit as a transparent overlay with a dark gradient scrim on top of the photo, not inside a solid box that covers the image. Double check this explicitly since it's the same class of bug we already had to fix once on Screen 2.

Base layout otherwise unchanged: small "X" close icon top-right (visual only, not clickable — "Let's go" is the only functional control on this screen). Headline (replacing "Let friends show another side of you"): **"The concert is over, but you can still connect."** Subtext (replacing the Friend's Take description): **"You'll have 24 hours to connect with others who love The Strokes as much as you do."** Only one pill button remains (remove the "Learn more" secondary pill entirely): full-width white pill button with copy **"Let's go"**.

**Interaction:** Tapping "Let's go" resets the demo back to Screen 1 (same behavior as the separate "Restart demo" control described in the Tech approach section — this button can simply call the same reset function).

## Copy reference (exact strings to use, don't paraphrase)
- Screen 1 banner: "Want to meet someone who loves The Strokes as much as you? Download Hinge Now"
- Screen 2 button: "Create account" (secondary text: "Sign in", non-functional)
- Screen 3 headline: "Tell us the basics"
- Screen 3 button: "Continue"
- Screen 4 headline: "Show a little more of who you are"
- Screen 4 subtext: "Prompts let people see who you are. in your own words."
- Screen 4 photo pill: "Upload a photo"
- Screen 4 prompt pill: "Your favorite Strokes song"
- Screen 4 button: "Continue"
- Screen 5 headline: "Ready to connect with someone new?"
- Screen 5 button: "See who's out there"
- Screen 6/8 header: "The Strokes at Citi Field"
- Screen 6/8/8a prompt label (shared, updated): "What are you most excited for tonight?"
- Screen 6/8/8a prompt answers (shared, per profile): Ryan: "Last Nite, it's a jam" / Mark: "I'm here for the openers" / Kiran: "TV on the Radio, supremely underrated" / John: "The vibes"
- Screen 6 button: "Continue"
- Screen 7 headline: "The concert has started!"
- Screen 7 subtext: "Get ready to meet someone new."
- Screen 7 button: "Reveal who's here"
- Screen 8 button: "End of night"
- Screen 9 headline: "The concert is over, but you can still connect."
- Screen 9 subtext: "You'll have 24 hours to connect with others who love The Strokes as much as you do."
- Screen 9 button: "Let's go"

## Explicitly out of scope for this build
- Existing-user flow (location-triggered auto opt-in, QR-scan-while-already-a-user path) — never-user flow only.
- Any real backend, data persistence, authentication, or face-check/verification logic — visual/click-through only.
- Partnership business mechanics — this prototype is UX/product concept only, focused on showing the partner-app-to-Hinge handoff (Screen 1 → Screen 2 transition).

## Deliverable
A folder containing `index.html` (+ `styles.css` / `script.js` if split out) and an `/images` folder with placeholder assets and the README described above, runnable by opening `index.html` directly in a browser.
