# State Management: Team Grid & Carousel

Because Astro renders React components as isolated "Islands," `TeamGrid` and `TeamCarousel` do not share a virtual DOM and cannot communicate via standard React Context. Instead of adding a state library like Nanostores or Redux, we use native browser `CustomEvent`s to create a lightweight publisher/subscriber model.

Shared constants and team data live in `teams.ts`:

- `TEAM_SELECTED_EVENT` — event name used by both components
- `TEAMS` — team list (id, name, description, green silhouettes for the grid, blue silhouettes for the carousel)
- `TEAMS_BY_ID` — O(1) lookup map used by `TeamGrid` layout helpers

## How it Works

### 1. The Publisher (`TeamGrid.tsx`)

When a user clicks a team card, the grid dispatches a custom event to `window` containing the team id, then scrolls to the team detail section.

```tsx
import { TEAM_SELECTED_EVENT, TEAMS_BY_ID } from "../../lib/teams";

const handleTeamClick = (teamId: string) => {
  const event = new CustomEvent(TEAM_SELECTED_EVENT, { detail: teamId });
  window.dispatchEvent(event);

  const targetSection = document.getElementById("team");
  if (targetSection) {
    targetSection.scrollIntoView();
  }
};
```

Team lookup for rendering each card uses `TEAMS_BY_ID` instead of repeated `find()` calls:

```tsx
const team = (id: string) => TEAMS_BY_ID[id];
```

`TeamGrid` itself holds no team-selection state — it's a pure publisher. Layout is two static grids (mobile: 3/1/3 row split; desktop: 4/3 row split with Graphics spanning two columns), each rendering `TeamCard` per team with a `breakpoint` prop controlling which silhouette heights to use.

### 2. The Subscriber (`TeamCarousel.tsx`)

The carousel listens for `TEAM_SELECTED_EVENT` on mount and, when it fires, computes how many steps forward or backward to move from its current position to reach the selected team — then hands that off to its own internal transition state machine (see below).

```tsx
import { TEAMS, TEAM_SELECTED_EVENT } from "../../lib/teams";

useEffect(() => {
  const handleTeamSelected = (e: Event) => {
    const customEvent = e as CustomEvent<string>;
    const selectedTeamId = customEvent.detail;

    const targetIndex = TEAMS.findIndex((t) => t.id === selectedTeamId);
    if (targetIndex !== -1) {
      setStep((prev) => {
        const currentIndex =
          ((prev % TEAMS.length) + TEAMS.length) % TEAMS.length;
        let diff = targetIndex - currentIndex;

        if (diff > 3) diff -= TEAMS.length;
        if (diff < -3) diff += TEAMS.length;

        return prev + diff;
      });
    }
  };

  window.addEventListener(TEAM_SELECTED_EVENT, handleTeamSelected);
  return () =>
    window.removeEventListener(TEAM_SELECTED_EVENT, handleTeamSelected);
}, []);
```

The `diff > 3` / `diff < -3` clamping picks whichever direction is the shorter way around the 7-team wheel, so jumping from Video to Web Dev (adjacent going forward) doesn't spin the cog almost all the way around backward.

## Why this approach?

- **Zero dependencies:** Uses built-in Web APIs; no need for external stores.
- **Decoupled:** The grid and carousel do not import each other. Removing one from the page will not break the other.

## Understanding `TeamCarousel`'s Internal State

Unlike `TeamGrid`, which is mostly stateless UI, `TeamCarousel` runs its own
small animation state machine to handle the cog spin transition. If you're
editing this component, the key thing to understand is that **"what's
currently selected" and "what's currently drawn on screen" are two
different pieces of state**, kept deliberately separate so the outgoing
team can animate out while the incoming team animates in.

### The state pieces

- **`step`** — an ever-incrementing/decrementing integer representing the
  logical position in the team list. It is _not_ clamped to `0..6`; it can
  go negative or past `TEAMS.length`. This is intentional — it lets the cog
  always spin in a consistent direction (e.g. always forward when you keep
  clicking "next") instead of snapping backward when wrapping from the last
  team to the first. The actual team is resolved via modulo:
  `((step % TEAMS.length) + TEAMS.length) % TEAMS.length`.

  Every transition — whether from a prev/next click or from
  `TEAM_SELECTED_EVENT` — funnels through a single `setStep` call. Nothing
  else in this component triggers a transition directly; the `useEffect`
  watching `step` (described below) is what actually drives all the
  animation state.

- **`displayStep`** — the step value that's _actually rendered_ right now.
  This only updates once the transition timer finishes — it's what keeps
  the outgoing team's content visible while it animates away, instead of
  swapping instantly the moment you click.
- **`visibleStepRef`** — a `ref` mirroring the last step that finished
  displaying. Because refs don't trigger re-renders, this exists purely so
  the transition effect can compare the new `step` against "what was
  actually last shown" without that comparison itself causing extra
  renders. It's kept in sync with `displayStep` at the same moment, inside
  the timer callback.
- **`outgoingStep`** — `null` when idle, or the step that was last actually
  displayed (read from `visibleStepRef.current` at the moment a new
  transition starts) while a transition is in flight. Its presence is what
  tells the render logic "we're mid-transition, render both an outgoing
  and incoming team."
- **`spinDeg` / `direction`** — how far (in degrees) and which way the cog
  should rotate for the current transition. Multiplied by 60° per team
  step, since there are 6 team-to-team gaps around the wheel.
- **`descOpacity`** — fades the description text out during the spin and
  back in once settled, so the text doesn't visibly swap mid-rotation.

### How a transition actually happens

1. `step` changes — either from a prev/next button click, or from the
   `TEAM_SELECTED_EVENT` handler when the grid dispatches a selection.
2. The `useEffect` watching `step` fires, compares the new `step` against
   `visibleStepRef.current` (the last step that finished displaying), and
   computes the spin direction/distance from that diff.
3. It sets `outgoingStep` to `visibleStepRef.current`, fades the
   description out, and kicks off a `window.setTimeout` for
   `SPIN_DURATION_MS` (700ms).
4. Because `outgoingStep` is now non-null, the render logic mounts **two**
   `SpinningTeamContent` instances simultaneously: one for the outgoing
   team (`phase="exit"`) and one for the incoming team (`phase="enter"`).
   Each phase maps to a different CSS animation class
   (`team-spin-out-fast` / `team-spin-in`).
5. When the timeout fires, it updates `visibleStepRef.current` to the new
   `step`, sets `displayStep` to match, clears `outgoingStep` back to
   `null`, and restores `descOpacity`. This is the moment the transition
   is considered "done."

**Important:** completion is currently detected by a `setTimeout` set to
`SPIN_DURATION_MS`, not by the CSS animation's actual `animationend` event.
This means the JS timer and the CSS animation duration are two independent
mechanisms that happen to be kept equal — see the caveat below.

### Rendering the cog itself

`Cog.svg` is drawn once as a plain `<img>`, rotated by a running total
(`rotation = step * 60`) via a CSS `transform`, and transitions smoothly
between rotations using a Tailwind `transition-transform duration-700`
class — this is a separate, simpler rotation than the enter/exit content
animation described above. The title text, description circle, and (on
desktop) the ghost silhouettes are layered on top as separate absolutely
positioned elements anchored to fixed coordinates within the cog's own
`viewBox` (see `COG_ANCHORS` and the `cogPct()` helper, which converts a
raw SVG coordinate into a percentage of the cog's rendered size).

Mobile and desktop use different anchor points and different title
treatments (`FlatTeamName` on mobile, `ArchedTeamName` via SVG `textPath`
on desktop) — this was a deliberate layout choice, not a bug, so the title
placement doesn't need to match 1:1 between breakpoints.

### Things to watch out for when editing this component

- **`SPIN_DURATION_MS` and the CSS keyframe duration are linked via
  template interpolation, not independently hardcoded.** The constant is
  interpolated directly into the `<style>` block
  (` animation: teamSpinOutFast ${SPIN_DURATION_MS}ms ...`), so today
  they're always equal by construction. If you ever refactor the animation
  duration into a separately hardcoded CSS value instead of this template
  literal, you'd reintroduce the risk of the JS timer and the actual
  visual animation drifting out of sync (the state would "finish" before
  or after the animation visually does).
- **The transition timer is a plain `setTimeout`, not tied to the actual
  animation finishing.** If a browser tab is throttled/backgrounded, or if
  rendering is unusually slow, the timer could fire before the animation
  has visually completed (or vice versa), causing a visible snap. This is
  an inherent tradeoff of the current timer-based approach — using the
  real `animationend` event instead would tie completion to what's
  actually on screen, at the cost of slightly more complex event wiring.
- **Rapid clicking mid-transition.** The `useEffect` re-runs any time
  `step` changes, including while a previous transition's timer is still
  pending. The effect's cleanup (`window.clearTimeout(timer)`) cancels the
  in-flight timer before React runs the effect again for the new `step`
  value, so rapid clicks should chain correctly rather than leaving stale
  timers running — but this is the trickiest part of the state machine to
  reason about, and worth manually testing (rapid-fire clicking through
  several teams) after any changes here.
- **Silhouette scale/offset adjustments are derived from `alt` text, not
  from team id.** `getSilhouetteAdjustments` (inside `TeamCarousel.tsx`)
  lower-cases each blue silhouette's `alt` string and checks it with
  `.includes("fuuka")`, `.includes("aigis")`, `.includes("yukari")`, or
  `.includes("ken")`/`.includes("koromaru")` to decide per-character scale
  and horizontal offset, layered on top of a base value that depends on
  whether the team has exactly 3 silhouettes (`isTrio`). This means
  **changing a silhouette's `alt` text for accessibility reasons can
  silently change its visual position** on the carousel, with no error or
  warning — the two are coupled by an implicit string match inside
  `TeamCarousel.tsx`, not an explicit field in `teams.ts`. If you add a new
  character or rename an existing one's `alt` text, double-check this
  function's `if`/`else if` chain to see whether it's still matching
  correctly. This logic only affects the carousel's blue silhouettes — the
  green silhouettes in `TeamGrid`/`TeamCard` use their `heightMobile`/
  `heightDesktop` fields directly from `teams.ts` with no string matching.

## Extra Notes

- **Astro client directives:** Both components must be hydrated on the
  client (e.g. `client:load` in `about.astro`) since both rely on
  `window`, event listeners, and interactive state.
- **Scroll behavior:** Clicking a grid card scrolls to `#team` via a plain
  `scrollIntoView()` call with no options object. Smooth scrolling is
  expected to come from a global `scroll-behavior: smooth` rule rather
  than being passed per-call — confirm this is still set in your global
  CSS if the scroll ever starts jumping instead of animating.
- **Type safety:** The event payload (`detail`) is a `string` (the team
  id). Cast to `CustomEvent<string>` in the subscriber so TypeScript
  recognizes the payload.
- **Memory leak prevention:** The listener is attached to `window`, not a
  component instance. Always remove it in the `useEffect` cleanup to avoid
  dangling references and duplicate handlers.
- **Accessibility:** `TeamCard` renders as a `<button>` (not a `<div>`
  with a click handler), so grid items are keyboard-focusable and have an
  `aria-label` of `View {team.name} team`. Carousel prev/next buttons
  similarly use `aria-label` (`Go to {team.name}`) rather than relying on
  their visible text alone.
- **Reduced motion:** Both the cog's rotation transition and the
  enter/exit content animations are disabled under
  `prefers-reduced-motion: reduce` (`motion-reduce:transition-none` on the
  cog wrapper, and an explicit `@media (prefers-reduced-motion: reduce)`
  block turning off the keyframe animations entirely).
- **Cog asset:** `Cog.svg` is a real design asset pulled from Figma (not a
  placeholder or a generic "gear with teeth" shape) — it's imported once
  and reused for every team; only the CSS rotation changes between teams,
  not the underlying image.
