# PRD: Palette Contrast Checker Web App

## Document status
- Status: Draft for implementation
- Audience: Claude / implementation agent
- Target release: MVP
- Platform: Frontend-only web app deployable to GitHub Pages
- Storage: Browser localStorage only
- Language: English only

## 1. Product summary

Build a beginner-friendly web app that helps general users evaluate a color palette for accessibility. Users can enter colors manually in common CSS formats, pick colors from the screen where supported, and automatically evaluate every directional text/background combination in the palette.

The app must:
- compute contrast ratios for all valid text/background pairs
- classify each pair against WCAG 2.2 thresholds for normal text, large text, and non-text UI elements
- clearly identify which combinations are usable
- clearly warn when the palette does not contain qualifying combinations for one or more categories
- suggest additional light and dark colors when the palette lacks recommended AAA combinations for normal text, and also on explicit user request
- let users add selected suggestions back into the palette and rerun analysis
- support local persistence, palette import/export, analysis export, and optional shareable palette URLs that work on GitHub Pages

The product is a utility tool, not a teaching tool. Explanatory education content should be minimal.

## 2. Problem statement

Beginner designers often choose colors that look good together but fail accessibility contrast requirements. Existing contrast tools often check only one pair at a time, assume expert knowledge, or do not help users repair weak palettes.

Users need a tool that can:
- inspect a whole palette at once
- show all directional combinations automatically
- tell them what is usable for real UI/text cases
- surface missing contrast coverage
- propose new colors that fit the palette well enough to solve the problem

## 3. Target users

### Primary user
A general user who is doing early-stage visual design and is not a color or accessibility expert.

### Typical user traits
- knows basic color picking, but not accessibility rules in detail
- may work from inspiration colors, screenshots, or copied color values
- needs practical answers, not deep theory
- wants a browser-based tool with no account setup

## 4. Goals

### MVP goals
1. Let users enter and manage a palette using common color formats.
2. Evaluate every directional foreground/background pair automatically.
3. Show contrast ratio and WCAG 2.2 pass/fail classification for:
   - normal text
   - large text
   - non-text UI elements
4. Show live text previews and minimal UI-result previews.
5. Flag missing coverage, especially when no pair qualifies for one or more categories.
6. Suggest accessible light and dark colors that fit the current palette.
7. Let users add selected suggestions into the palette and rerun analysis.
8. Persist work locally, including crash recovery behavior.
9. Export/import palette data and export analysis results.
10. Remain simple and usable for beginners.

### Non-goals for MVP
- authentication
- backend storage
- multi-user collaboration
- mobile-first support
- Firefox/Safari-first support
- full educational curriculum about color theory
- gradients, alpha transparency, image overlays, blend modes
- design tool plugins
- design token or codebase integrations
- automatic verification of real rendered app screenshots beyond user-provided solid colors

## 5. Success criteria

### Product success
- Users can create a palette, run analysis, and identify usable combinations without reading documentation.
- Users can recover a work-in-progress palette after a browser crash or forced reload.
- Users can export palette data and analysis data without a backend.

### UX success
- A first-time user can enter at least two colors and run analysis in under 2 minutes.
- Results clearly communicate usable vs unusable combinations.
- Suggested colors make it easier to produce at least one AAA-normal-text pair when the original palette lacks one.

### Technical success
- The app works as a static frontend deployable on GitHub Pages.
- State persistence functions entirely in localStorage.
- Palette-only shareable URLs function without a backend.

## 6. Constraints and assumptions

- Platform: GitHub Pages static hosting
- Architecture: frontend only for MVP
- Persistence: localStorage only
- Browser target: latest Chrome desktop only
- Layout target: desktop only
- Framework: framework-agnostic in this PRD
- Accessibility standard: WCAG 2.2
- Input scope: solid colors only
- Internal canonical storage format: hex
- Input formats accepted:
  - CSS named colors
  - RGB
  - HSL
  - hexadecimal
- EyeDropper support: use where available, with graceful fallback when unavailable

## 7. WCAG evaluation rules for MVP

Use WCAG 2.2 contrast thresholds for solid-color comparisons.

### Categories
1. Normal text
2. Large text
3. Non-text UI elements

### Thresholds
- Normal text:
  - AA: 4.5:1
  - AAA: 7:1
- Large text:
  - AA: 3:1
  - AAA: 4.5:1
- Non-text UI elements:
  - AA: 3:1
  - AAA: not applicable for MVP reporting

### Display rules
- If a pair passes AAA for a category, do not redundantly label it as passing AA for that same category.
- Contrast value is identical regardless of direction, but directional combinations must still be shown separately because they are visually different.
- Example with 3 colors:
  - A on B
  - A on C
  - B on A
  - B on C
  - C on A
  - C on B
  - Total = 6 combinations

## 8. Key product decisions already made

- Audience is beginners, not field experts.
- The app starts empty unless a WIP palette exists in localStorage.
- Minimum palette size to analyze is 2 colors.
- Duplicate colors are not allowed after canonicalization.
- Exact duplicate raw input should be blocked on entry.
- Equivalent colors entered in different formats should be merged before analysis.
- When duplicate-resolution merge happens, the app must ask the user which label to keep:
  - one of the original user inputs
  - or the canonical hex value
- Users can edit preview text.
- Default preview text should be the pangram: “The quick brown fox jumps over the lazy dog.”
- Users can choose preview font from a small fixed list.
- Users can adjust preview size with a slider.
- Hover, focus, active, and disabled state contrast checks are in scope for MVP, but only as rule evaluation / pass-fail output, not full visual simulation.
- Non-text UI previews in MVP are pass/fail only.
- Suggested colors:
  - generated automatically when the palette lacks AAA combinations for normal text
  - also available on user request
  - 6 dark suggestions
  - 6 light suggestions
  - half palette-derived
  - half neutral
- Users can select one or more suggestions, add them to the palette, and rerun analysis.
- Warning threshold for performance risk is initially 10 colors.
- Users may exceed the threshold after warning.
- Before starting analysis, save the current palette as WIP to localStorage for crash recovery.
- One WIP palette is auto-saved.
- Additional palettes can be saved with user-defined names.
- If saving under an existing name:
  - show that a palette with that name already exists
  - show the existing palette
  - ask whether to overwrite

## 9. User experience principles

1. Beginner-first wording  
   Prefer plain language over accessibility jargon where possible.

2. Practical output  
   Tell users which combinations are usable for real scenarios.

3. Low setup friction  
   No account, no backend, no required tutorial.

4. Visible recoverability  
   Users should feel safe testing large palettes because WIP is saved before analysis.

5. Deterministic behavior  
   Duplicate resolution, sorting, filtering, import/export, and suggestion behavior should be predictable.

## 10. Information architecture

## Main areas
1. Palette input and management
2. Preview controls
3. Analysis controls
4. Results grid / matrix / list
5. Suggestion panel
6. Save / load / import / export controls
7. Alerts and recovery notices

## 11. Core user flows

### Flow A: Create a palette and analyze it
1. User enters at least two colors.
2. App validates each input inline.
3. App canonicalizes accepted colors to hex internally.
4. If the new color duplicates an existing color after canonicalization:
   - app starts merge resolution
   - user chooses which label to keep
   - only one palette entry remains
5. User clicks Analyze.
6. App saves current palette as WIP to localStorage.
7. If palette size exceeds warning threshold:
   - show warning that more colors could cause the browser to crash
   - user may continue
8. App computes all directional combinations.
9. App shows results with filters, sort options, previews, and pass/fail information.
10. If no qualifying combinations exist for one or more categories, app shows clear alerts.
11. If no AAA-normal-text combination exists, app automatically generates suggestions.

### Flow B: Add colors using the color picker
1. User clicks Pick color from screen.
2. If EyeDropper API is supported:
   - browser picker opens
   - selected color is added through the same validation/canonicalization flow
3. If not supported:
   - show clear message that screen color picking is not available in this browser
   - manual entry remains available

### Flow C: Review suggestions and add them to the palette
1. Suggestions panel opens automatically when triggered, or manually when the user requests suggestions.
2. App shows 12 suggestions total:
   - 6 dark
   - 6 light
   - each group split between palette-derived and neutral suggestions
3. Each suggestion shows:
   - color swatch
   - canonical hex value
   - indication of which existing palette colors it pairs with successfully
   - category coverage it passes for
4. User selects one or more suggestions.
5. User clicks Add to palette.
6. App adds selected suggestions into the palette.
7. User reruns analysis.

### Flow D: Save, load, import, export
1. User can save current palette as WIP automatically.
2. User can save current palette with a custom name.
3. User can load a named palette from localStorage.
4. User can import palette CSV.
5. User can export palette CSV.
6. User can export analysis as:
   - markdown report
   - CSV
   - JSON
7. User can create a shareable URL containing palette state only, if enabled in implementation.

### Flow E: Crash recovery
1. Before analysis starts, WIP palette is saved to localStorage.
2. Browser crashes or tab is force-closed during heavy analysis.
3. On next load, app detects WIP palette.
4. App offers to restore it automatically or loads it directly, depending on final UX choice.
5. User removes colors and tries again.

## 12. Functional requirements

### 12.1 Palette input
The app must:
- allow manual color entry in:
  - CSS named colors
  - RGB
  - HSL
  - hex
- validate input inline before adding to the palette
- reject invalid color values immediately
- canonicalize accepted values to hex for internal storage and computation
- display both:
  - the stored canonical hex value
  - the original user-entered value currently associated with the color
- block exact duplicate raw input entries when obviously identical
- detect equivalent colors across formats after canonicalization
- merge equivalent colors prior to analysis
- require user label selection during merge resolution
- allow color deletion
- allow manual color reordering
- allow technically unlimited colors
- warn when palette exceeds 10 colors because analysis may crash the browser

### 12.2 Duplicate resolution
When equivalent colors are detected:
- retain only one canonical color entry
- prompt the user to choose the retained display label from:
  - each original input representation
  - the canonical hex value
- store the chosen label for display/export purposes
- do not compute duplicates as separate colors

### 12.3 Analysis engine
The app must:
- require at least 2 colors before analysis
- save WIP palette to localStorage before analysis begins
- evaluate every directional text/background pair
- compute contrast ratio for each pair
- classify each pair for:
  - normal text AA / AAA
  - large text AA / AAA
  - non-text UI AA
- support state checks for hover, focus, active, and disabled as MVP logic/reporting scope
- clearly indicate missing qualifying combinations across categories
- automatically trigger suggestions when there is no AAA-normal-text pair in the palette

### 12.4 Results display
The app must show each directional pair as a result item or row.

Each result must show:
- foreground color
- background color
- preview text
- contrast ratio
- pass/fail or pass-level status for:
  - normal text
  - large text
  - non-text UI
- optional state-check section for hover/focus/active/disabled evaluation
- indication that AAA supersedes AA in display for the same category

### 12.5 Live preview controls
The app must provide:
- editable preview text field
- default text: “The quick brown fox jumps over the lazy dog.”
- font family selector with:
  - Arial
  - Georgia
  - Verdana
  - Trebuchet MS
  - Times New Roman
  - Courier New
  - system-ui
- font size slider
- live update of relevant text previews

### 12.6 Non-text UI element handling
For MVP:
- include non-text UI contrast evaluation
- show pass/fail results
- do not require rich visual component previews for non-text elements
- a simple textual pass/fail indicator is sufficient

### 12.7 Filters
The app must support these result filters:
- show all
- only failures
- only AA pass
- only AAA pass
- only normal text passes
- only large text passes
- only non-text passes
- filter by foreground color
- filter by background color

### 12.8 Sorting
The app must support sorting by:
- highest contrast
- lowest contrast
- pass status
- foreground color
- background color

### 12.9 Suggestions engine
The app must:
- generate suggestions automatically when no AAA-normal-text combination exists
- also allow manual suggestion generation on request
- generate 12 suggestions total:
  - 6 light
  - 6 dark
- within each light/dark set:
  - half should be palette-derived
  - half should be neutral
- ensure suggestions are new colors, not duplicates of existing canonical palette colors
- display for each suggestion:
  - swatch
  - hex value
  - whether it is palette-derived or neutral
  - which existing palette colors it pairs with successfully
  - which categories it passes for
- allow selecting one or more suggestions
- allow batch-adding selected suggestions to the palette

### 12.10 Storage
The app must use localStorage for:
- WIP palette
- named saved palettes
- user preferences such as filters and preview settings
- possibly recent exports metadata if implementation finds this useful

Behavior:
- load WIP palette on page load if present
- allow saving named palettes
- warn when saving over an existing palette name
- show the existing palette before confirming overwrite

### 12.11 Import/export
#### Palette CSV import/export
Palette CSV must store, per row:
- canonical hex value
- chosen user-facing input label after duplicate resolution

#### Analysis export
The app must export analysis as:
- markdown report
- CSV
- JSON

### 12.12 Shareable URLs
If implemented in MVP, shareable URLs must:
- work on GitHub Pages
- encode palette state only
- not require backend storage
- not include full user preference state

### 12.13 Recovery and resilience
The app must:
- save WIP palette before running analysis
- recover WIP state after reload
- surface a recovery notice if appropriate
- not silently discard user work after a heavy analysis attempt

## 13. Accessibility requirements for the app itself

The app evaluates accessibility and therefore must itself be reasonably accessible.

MVP requirements:
- keyboard-accessible controls
- visible focus states
- semantic labeling for form elements
- screen-reader-friendly form and result structure
- no color-only communication for pass/fail
- accessible alerts and validation messages
- reduced-motion-friendly behavior where motion exists
- desktop Chrome accessibility as a minimum target

## 14. Performance requirements

### Initial operating assumptions
- Directional pair count grows as N × (N - 1)
- With 10 colors, there are 90 directional combinations

### MVP behavior
- Warn users when palette size exceeds 10 colors
- Allow users to proceed after warning
- Save WIP before analysis to protect against crashes

### Performance requirement
- Analysis should complete without freezing the interface for typical palettes up to 10 colors on a modern desktop browser, subject to implementation quality.
- If implementation testing shows instability below 10 colors, lower the warning threshold.

## 15. Data model guidance

This section is guidance, not a mandated schema.

### Palette color
- `id`
- `hex`
- `displayLabel`
- `originalInputs[]` (optional but useful during duplicate resolution)
- `sourceType` (manual, eyedropper, suggestion-import, csv-import)
- `position`

### Result item
- `foregroundHex`
- `backgroundHex`
- `contrastRatio`
- `normalTextLevel` (fail, AA, AAA)
- `largeTextLevel` (fail, AA, AAA)
- `nonTextLevel` (fail, AA)
- `stateChecks` (hover, focus, active, disabled as implemented)
- `sortKeys`

### Saved palette
- `name`
- `colors[]`
- `updatedAt`

### Preferences
- `previewText`
- `fontFamily`
- `fontSize`
- `activeFilters`
- `activeSort`

## 16. Edge cases

The implementation must handle:
- invalid color input
- fewer than 2 colors
- duplicate colors entered in different formats
- duplicate colors entered by EyeDropper and manual input
- CSS named colors resolving to existing hex values
- very large palettes beyond warning threshold
- unsupported EyeDropper API
- overwrite attempts for saved palette names
- empty localStorage
- malformed CSV import
- share URL parse failure
- extremely long preview text
- user removing colors until results become invalid
- imported palette rows with duplicated canonical hex values
- manual suggestion generation even when qualifying AAA pairs already exist

## 17. Open implementation notes

These are intended to guide Claude without hard-coding a framework.

1. Consider structuring analysis and suggestion logic as pure functions for easier testing.
2. Separate canonical color parsing from UI state management.
3. Duplicate resolution should be an explicit state in the UI, not a silent merge.
4. Result rendering should be filterable and sortable without recomputing contrast ratios.
5. Shareable URL support should likely use query or hash encoding to remain GitHub Pages friendly.
6. State-check logic for hover/focus/active/disabled must be clearly defined in implementation since no detailed visual simulation is required in MVP.
7. Non-text evaluation can remain simple in MVP, but the result model should leave room for richer UI previews later.

## 18. MVP screens / sections

### Screen 1: Main app
Sections:
- header / app title
- palette editor
- preview controls
- analysis action area
- results filters and sorting
- results list/grid
- suggestion panel
- save/load/import/export controls
- recovery and alert messages

## 19. Detailed backlog

## Epic A: Palette creation and management

### Story A1: Add colors manually
As a user, I want to enter a color manually so that I can build a palette from values I already have.

#### Acceptance criteria
- User can enter CSS named color, RGB, HSL, or hex.
- Invalid input is blocked with inline validation.
- Valid input is converted to canonical hex internally.
- Added color appears in the palette list with canonical hex and chosen display label.

### Story A2: Add colors with EyeDropper
As a user, I want to sample a color from the screen so that I can capture colors from inspiration sources.

#### Acceptance criteria
- If EyeDropper is supported, user can launch it and add the returned color.
- If unsupported, app shows a clear fallback message.
- Picked color goes through the same duplicate and validation logic as manual entries.

### Story A3: Prevent or merge duplicates
As a user, I want duplicate colors handled intelligently so that I do not get misleading repeated results.

#### Acceptance criteria
- Exact duplicate raw input is blocked immediately where detectable.
- Equivalent colors across formats are detected after canonicalization.
- User is prompted to choose which label to keep.
- Only one canonical color remains after merge.

### Story A4: Reorder and delete colors
As a user, I want to reorder or remove colors so that I can refine the palette easily.

#### Acceptance criteria
- User can delete any palette color.
- User can reorder colors manually.
- Reordering persists in current session and saved palette state.

## Epic B: Preview controls

### Story B1: Edit preview text
As a user, I want to change the preview sentence so that I can test more realistic content.

#### Acceptance criteria
- Preview text field is editable.
- Default value is “The quick brown fox jumps over the lazy dog.”
- Results update live when preview text changes.

### Story B2: Change font and size
As a user, I want to adjust the preview font and size so that I can inspect readability more realistically.

#### Acceptance criteria
- User can choose among the approved font list.
- User can adjust size with a slider.
- Preview text updates live.

## Epic C: Contrast analysis

### Story C1: Analyze all directional pairs
As a user, I want every foreground/background combination analyzed so that I can see all usable pairings in one place.

#### Acceptance criteria
- Analysis requires at least 2 colors.
- For N colors, app computes N × (N - 1) directional pairs.
- Each directional pair appears separately in results.

### Story C2: Classify by WCAG category
As a user, I want each pair classified for different use cases so that I know whether it works for body text, large text, or UI elements.

#### Acceptance criteria
- Each pair includes contrast ratio.
- Each pair includes classification for normal text, large text, and non-text UI.
- AAA display supersedes AA display within the same category.

### Story C3: Report state-check outcomes
As a user, I want hover, focus, active, and disabled state checks included so that I can think about interactive design states too.

#### Acceptance criteria
- Result model includes state-check output for supported states.
- UI communicates pass/fail or equivalent status for those states.
- MVP does not require rich visual simulation for these states.

### Story C4: Warn about missing coverage
As a user, I want the app to tell me when my palette cannot satisfy a category so that I know what problem I need to fix.

#### Acceptance criteria
- App shows a clear alert when no pair qualifies for normal text.
- App shows a clear alert when no pair qualifies for large text.
- App shows a clear alert when no pair qualifies for non-text UI.
- Alerts remain visible until palette or filters change.

## Epic D: Results discovery

### Story D1: Filter results
As a user, I want to filter the combinations so that I can focus on failures or only the combinations that matter.

#### Acceptance criteria
- App supports all required filters.
- Filters can be combined where sensible.
- Filter state persists in local preferences.

### Story D2: Sort results
As a user, I want to sort the results so that I can quickly find the strongest or weakest pairs.

#### Acceptance criteria
- App supports all required sort options.
- Sorting does not recompute contrast ratios unnecessarily.
- Current sort is visible in the UI.

## Epic E: Suggestions

### Story E1: Auto-suggest when AAA is missing
As a user, I want the app to suggest new colors when my palette lacks AAA pairs for normal text so that I can repair the palette faster.

#### Acceptance criteria
- Suggestions are generated automatically when no AAA-normal-text pair exists.
- App shows 6 dark and 6 light suggestions.
- Each set includes half palette-derived and half neutral options.

### Story E2: Manual suggestion generation
As a user, I want to request suggestions even if the palette already has AAA pairs so that I can expand my palette intentionally.

#### Acceptance criteria
- User can request suggestions manually at any time after minimum palette requirements are met.
- Suggestions respect duplicate avoidance against existing palette colors.

### Story E3: Inspect and add suggestions
As a user, I want to see why a suggestion is useful and add selected ones back into my palette.

#### Acceptance criteria
- Each suggestion shows its hex value and type.
- Each suggestion shows which existing palette colors it pairs with successfully.
- Each suggestion shows which categories it passes.
- User can multi-select suggestions and add them to the palette.

## Epic F: Persistence and recovery

### Story F1: Auto-save WIP
As a user, I want my current palette saved automatically before analysis so that I do not lose work if the browser crashes.

#### Acceptance criteria
- WIP palette is saved before analysis begins.
- Reloading the page restores WIP or clearly offers restoration.
- Crash recovery does not require server storage.

### Story F2: Save named palettes
As a user, I want to save palettes by name so that I can compare and revisit my work.

#### Acceptance criteria
- User can save a named palette to localStorage.
- Existing names trigger overwrite warning.
- Existing palette is shown before overwrite confirmation.

### Story F3: Store preferences
As a user, I want my filters and preview settings remembered so that I can continue where I left off.

#### Acceptance criteria
- Preview text, font, size, filters, and sort settings persist in local preferences.
- App restores these on reload where practical.

## Epic G: Import/export and sharing

### Story G1: Import and export palette CSV
As a user, I want to import and export palette CSV files so that I can move palettes in and out of the tool.

#### Acceptance criteria
- Export CSV includes canonical hex and chosen display label per row.
- Import validates rows and handles duplicates.
- Malformed rows produce clear errors.

### Story G2: Export analysis
As a user, I want to export my results so that I can document or share my findings.

#### Acceptance criteria
- User can export analysis as markdown, CSV, and JSON.
- Export reflects current palette and full analysis data.
- Export does not require backend support.

### Story G3: Create shareable palette URL
As a user, I want a URL that recreates the palette so that I can share the palette state without a backend.

#### Acceptance criteria
- URL contains palette state only.
- Opening the URL restores palette state in the app.
- URL works on GitHub Pages.

## Epic H: Accessibility and UX polish

### Story H1: Accessible app controls
As a user relying on keyboard or screen reader support, I want the app itself to be accessible.

#### Acceptance criteria
- Core controls are keyboard reachable.
- Validation and alerts are screen-reader readable.
- Pass/fail is not communicated by color alone.
- Focus states are visible.

## 20. Testing guidance for Claude

The implementation should include tests around:
- parsing each supported color format
- canonicalization to hex
- duplicate detection across formats
- duplicate label selection flow
- directional pair count calculation
- WCAG threshold classification
- automatic suggestion trigger conditions
- suggestion deduplication
- CSV import/export behavior
- localStorage persistence and recovery
- shareable palette URL encoding/decoding
- filter and sort correctness
- state-check reporting logic

## 21. Launch checklist

Before considering MVP done, verify:
- static deployment works on GitHub Pages
- Chrome desktop flow works end to end
- analysis works for at least 10 colors without unacceptable instability, or threshold is adjusted downward
- WIP recovery works after forced reload
- invalid inputs are blocked
- duplicate resolution works correctly
- CSV palette import/export works
- markdown / CSV / JSON analysis exports work
- accessible labeling and keyboard operation are in place

## 22. Future roadmap ideas

Not part of MVP, but reasonable later phases:
- mobile-responsive layout
- Firefox and Safari support
- richer component previews for non-text UI
- design-token import
- backend sync
- educational explanation mode
- plugin integrations
- screenshot-based palette extraction
- gradient and alpha-aware contrast analysis
