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
