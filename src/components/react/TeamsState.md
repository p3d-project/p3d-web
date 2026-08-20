# State Management: Team Grid & Carousel

Because Astro renders React components as isolated "Islands," `TeamGrid` and `TeamCarousel` do not share a virtual DOM and cannot communicate via standard React Context. Instead of adding a state library like Nanostores or Redux, we use native browser `CustomEvent`s to create a lightweight publisher/subscriber model.

Shared constants and team data live in `teams.ts`:

- `TEAM_SELECTED_EVENT` — event name used by both components
- `TEAMS` — team list (names, silhouettes, provisional cog angles)
- `TEAMS_BY_ID` — O(1) lookup map used by `TeamGrid` layout helpers

## How it Works

### 1. The Publisher (`TeamGrid.tsx`)

When a user clicks a team card, the grid dispatches a custom event to `window` containing the team id, then scrolls to the team detail section.

```tsx
import { TEAM_SELECTED_EVENT } from "../../lib/teams";

const handleTeamClick = (teamId: string) => {
  const event = new CustomEvent(TEAM_SELECTED_EVENT, { detail: teamId });
  window.dispatchEvent(event);

  const targetSection = document.getElementById("team");
  if (targetSection) {
    targetSection.scrollIntoView();
  }
};
```

Team lookup uses `TEAMS_BY_ID` instead of repeated `find()` calls.

### 2. The Subscriber (`TeamCarousel.tsx`)

The carousel manages its own local state (`currentIndex`). On mount, it listens for `TEAM_SELECTED_EVENT`, resolves the matching index in `TEAMS`, and updates.

```tsx
import { TEAMS, TEAM_SELECTED_EVENT } from "../../lib/teams";

useEffect(() => {
  const handleTeamSelected = (e: Event) => {
    const customEvent = e as CustomEvent<string>;
    const selectedTeamId = customEvent.detail;

    const targetIndex = TEAMS.findIndex((t) => t.id === selectedTeamId);
    if (targetIndex !== -1) {
      setCurrentIndex(targetIndex);
    }
  };

  window.addEventListener(TEAM_SELECTED_EVENT, handleTeamSelected);
  return () => window.removeEventListener(TEAM_SELECTED_EVENT, handleTeamSelected);
}, []);
```

## Why this approach?

- **Zero dependencies:** Uses built-in Web APIs; no need for external stores.
- **Decoupled:** The grid and carousel do not import each other. Removing one from the page will not break the other.

## Extra Notes

- **Astro client directives:** Both components must be hydrated on the client. In `about.astro`, they are loaded with `client:load`.
- **Scroll behavior:** Clicking a grid card scrolls to `#team` via `scrollIntoView()`. Smooth scrolling is handled globally by `scroll-behavior: smooth` in `global.css`.
- **Animation re-triggering:** In `TeamCarousel.tsx`, `key={currentIndex}` on the silhouette wrapper forces a remount so the enter animation replays on every team change.
- **Type safety:** The event payload (`detail`) is a `string` (the team id). Cast to `CustomEvent<string>` in the subscriber so TypeScript recognizes the payload.
- **Memory leak prevention:** The listener is attached to `window`, not a component instance. Always remove it in the `useEffect` cleanup to avoid dangling references and duplicate handlers.
- **Accessibility:** `TeamCard` renders as a `<button>` so grid items are keyboard-focusable. Carousel prev/next buttons include `aria-label` attributes.
- **Cog wheel angles:** Each entry in `TEAMS` has a provisional `angle` field (evenly spaced at 360 / 7). Re-tune these once the cog asset exists — final values depend on its dimensions and label placement.

## Understanding `TeamCarousel`'s Internal State

Unlike `TeamGrid`, which is mostly stateless UI, `TeamCarousel` runs its own
small animation state machine to handle the cog spin transition. If you're
editing this component, the key thing to understand is that **"what's
currently selected" and "what's currently drawn on screen" are two
different pieces of state**, kept deliberately separate so the outgoing
team can animate out while the incoming team animates in.

### The state pieces

- **`step`** — an ever-incrementing/decrementing integer representing the
  logical position in the team list. It is *not* clamped to `0..6`; it can
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

- **`displayStep`** — the step value that's *actually rendered* right now.
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

### Things to watch out for when editing this component

- **`SPIN_DURATION_MS` and the CSS keyframe duration are linked via
  template interpolation, not independently hardcoded.** The constant is
  interpolated directly into the `<style>` block
  (`` animation: teamSpinOutFast ${SPIN_DURATION_MS}ms ...``), so today
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
  from team id.** `getSilhouetteAdjustments` lower-cases each silhouette's
  `alt` string and checks it with `.includes("fuuka")`,
  `.includes("aigis")`, `.includes("yukari")`, or
  `.includes("ken")`/`.includes("koromaru")` to decide per-character scale
  and horizontal offset. This means **changing a silhouette's `alt` text
  for accessibility reasons can silently change its visual position** on
  the carousel, with no error or warning — the two are coupled by an
  implicit string match, not an explicit relationship. If you add a new
  character or rename an existing one's `alt` text, double-check this
  function's `if`/`else if` chain to see whether it's still matching
  correctly.