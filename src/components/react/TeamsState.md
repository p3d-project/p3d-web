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

The carousel listens for `TEAM_SELECTED_EVENT` on mount and, when it fires, computes the shortest path around the 7-team wheel, updates the step count, and orchestrates the transition phases.

```tsx
import { TEAMS, TEAM_SELECTED_EVENT } from "../../lib/teams";

useEffect(() => {
  const handleTeamSelected = (e: Event) => {
    const customEvent = e as CustomEvent<string>;
    const selectedTeamId = customEvent.detail;

    const targetIndex = TEAMS.findIndex((t) => t.id === selectedTeamId);
    if (targetIndex !== -1) {
      if (isAnimating) return;

      let diff = targetIndex - activeIndex;
      if (diff === 0) return;

      if (diff > 3) diff -= TEAMS.length;
      if (diff < -3) diff += TEAMS.length;

      setIsAnimating(true);
      setDirection(diff > 0 ? 1 : -1);
      setStep((s) => s + diff);
      setButtonIndex(targetIndex);
      setAnimPhase("exiting");

      setTimeout(() => {
        setActiveIndex(targetIndex);
        setAnimPhase("entering");

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setAnimPhase("settled");
          });
        });

        setTimeout(() => {
          setIsAnimating(false);
        }, 350);
      }, 350);
    }
  };

  window.addEventListener(TEAM_SELECTED_EVENT, handleTeamSelected);
  return () =>
    window.removeEventListener(TEAM_SELECTED_EVENT, handleTeamSelected);
}, [activeIndex, isAnimating]);
```

The `diff > 3` / `diff < -3` clamping picks whichever direction is the shorter way around the 7-team wheel, so jumping from Video to Web Dev (adjacent going forward) doesn't spin the cog almost all the way around backward.

## Why this approach?

- **Zero dependencies:** Uses built-in Web APIs; no need for external stores.
- **Decoupled:** The grid and carousel do not import each other. Removing one from the page will not break the other.

## Understanding `TeamCarousel`'s Internal State

Unlike `TeamGrid`, which is mostly stateless UI, `TeamCarousel` runs a transition state machine using `animPhase` (`"settled" | "exiting" | "entering"`) combined with explicit timers and nested `requestAnimationFrame` hooks to handle content entry and exit.

### The state pieces

- **`step`** — an ever-incrementing/decrementing integer representing the logical position in the team list used to calculate cog rotation (`rotation = step * DEGREES_PER_STEP`).

- **`activeIndex`** — the currently active team index (`0..6`) used to pull `currentTeam` from `TEAMS`.

- **`buttonIndex`** — tracks the target index for adjacent navigation previews (`prevTeam` and `nextTeam`).

- **`direction`** — `1` (clockwise/forward) or `-1` (counter-clockwise/backward) governing translation/rotation offsets during transitions.

- **`animPhase`** — controls whether content is `"settled"`, `"exiting"`, or `"entering"`, feeding into `getTransformAndOpacity()` to animate text and descriptions.

- **`isAnimating`** — boolean lock preventing overlapping transition triggers while an animation sequence is in flight.

### How a transition happens

1. A prev/next button click or `TEAM_SELECTED_EVENT` fires.

2. If `isAnimating` is true, the event is ignored. Otherwise, `isAnimating` locks to `true`.

3. `animPhase` is set to `"exiting"`, applying exit transforms over a 350ms `setTimeout`.

4. When the exit phase completes, `activeIndex` updates to the target, `animPhase` becomes `"entering"`, and nested `requestAnimationFrame` calls reset transforms instantly before pushing back to `"settled"`.

5. A final 350ms timeout unlocks `isAnimating` back to `false`.

### Rendering the cog itself

`Cog.svg` is rendered via an `<img>` tag and rotated via CSS `transform`. Content, descriptions, and desktop silhouettes are positioned absolutely using coordinate percentages (`cogPct()`) relative to the cog's `viewBox` (`3400px`).

Mobile and desktop use different anchor points and different title treatments (`FlatTeamName` on mobile, `ArchedTeamName` via SVG `textPath` on desktop).

### Things to watch out for when editing this component

- **GPU Acceleration Flags:** The rotating cog wrapper includes explicit hardware acceleration styles (`translate3d(0, 0, 0)`, `willChange: "transform"`, `transformStyle: "preserve-3d"`, `backface-visibility: hidden`, and `contain: "strict"`) to prevent Firefox from dropping layers or falling back to CPU rendering. **Do not remove these.**

- **Silhouette scale/offset adjustments are derived from `alt` text, not from team id.** `getSilhouetteAdjustments` lower-cases each blue silhouette's `alt` string and checks it with `.includes("fuuka")`, `.includes("aigis")`, `.includes("yukari")`, or `.includes("ken")`/`.includes("koromaru")` to adjust scaling and horizontal offsets. Changing a silhouette's `alt` text will silently affect its visual position.

## Extra Notes

- **Astro client directives:** Both components must be hydrated on the client (e.g., `client:load` in `about.astro`) since both rely on `window`, event listeners, and interactive state.* **Scroll behavior:** Clicking a grid card scrolls to `#team` via a plain `scrollIntoView()` call.

- **Type safety:** The event payload (`detail`) is a `string` (the team id) cast to `CustomEvent<string>`.

- **Memory leak prevention:** The event listener attached to `window` is cleaned up in `useEffect`.

- **Accessibility:** `TeamCard` renders as a `<button>` with an `aria-label` (`View {team.name} team`). Carousel buttons use matching `aria-label` attributes.

- **Reduced motion:** Both the cog's rotation transition and the enter/exit content animations are disabled under `prefers-reduced-motion: reduce` (`motion-reduce:transition-none` on the cog wrapper).
