import TeamCard from "./TeamCard";
import { TEAM_SELECTED_EVENT, TEAMS_BY_ID } from "../../lib/teams";

/** Hero grid of team cards. Publishes selection to TeamCarousel via TEAM_SELECTED_EVENT. */
export default function TeamGrid() {
  /** Notify the carousel and scroll to the team detail section. */
  const handleTeamClick = (teamId: string) => {
    const event = new CustomEvent(TEAM_SELECTED_EVENT, { detail: teamId });
    window.dispatchEvent(event);

    const targetSection = document.getElementById("team");
    if (targetSection) {
      targetSection.scrollIntoView();
    }
  };

  /** Resolve a team by id from the static layout config. */
  const team = (id: string) => TEAMS_BY_ID[id];

  return (
    <div className="flex h-full w-full flex-col justify-center">
      {/* Mobile layout (< lg) — row structure matches the Figma mockup. */}
      <div className="flex w-full flex-col gap-8 px-1 py-4 sm:gap-10 lg:hidden">
        {/* Row 1: Game Dev, Web Dev, UX/UI */}
        <div className="grid w-full grid-cols-3 items-end justify-items-center gap-1 sm:gap-3">
          <TeamCard
            team={team("game-dev")}
            onSelect={handleTeamClick}
            breakpoint="mobile"
          />
          <TeamCard
            team={team("web-dev")}
            onSelect={handleTeamClick}
            breakpoint="mobile"
          />
          <TeamCard
            team={team("ux-ui")}
            onSelect={handleTeamClick}
            breakpoint="mobile"
          />
        </div>

        {/* Row 2: Graphics */}
        <TeamCard
          team={team("graphics")}
          onSelect={handleTeamClick}
          breakpoint="mobile"
          className="w-full"
        />

        {/* Row 3: Music, 3D, Video */}
        <div className="grid w-full grid-cols-3 items-end justify-items-center gap-1 sm:gap-3">
          <TeamCard
            team={team("music")}
            onSelect={handleTeamClick}
            breakpoint="mobile"
          />
          <TeamCard
            team={team("3d")}
            onSelect={handleTeamClick}
            breakpoint="mobile"
          />
          <TeamCard
            team={team("video")}
            onSelect={handleTeamClick}
            breakpoint="mobile"
          />
        </div>
      </div>

      {/* Desktop layout (>= lg) — row structure matches the Figma mockup. */}
      <div className="hidden w-full flex-col justify-center gap-12 py-4 pr-2 pl-0 lg:flex lg:gap-16">
        {/* Top row: Game Dev, Web Dev, UX/UI, 3D */}
        <div className="grid w-full grid-cols-4 items-end justify-items-center gap-4 lg:gap-8">
          <TeamCard
            team={team("game-dev")}
            onSelect={handleTeamClick}
            breakpoint="desktop"
          />
          <TeamCard
            team={team("web-dev")}
            onSelect={handleTeamClick}
            breakpoint="desktop"
          />
          <TeamCard
            team={team("ux-ui")}
            onSelect={handleTeamClick}
            breakpoint="desktop"
          />
          <TeamCard
            team={team("3d")}
            onSelect={handleTeamClick}
            breakpoint="desktop"
          />
        </div>

        {/* Bottom row: Graphics (span 2), Music, Video */}
        <div className="grid w-full grid-cols-4 items-end justify-items-center gap-4 lg:gap-8">
          <TeamCard
            team={team("graphics")}
            onSelect={handleTeamClick}
            breakpoint="desktop"
            className="col-span-2"
          />
          <TeamCard
            team={team("music")}
            onSelect={handleTeamClick}
            breakpoint="desktop"
            className="col-span-1"
          />
          <TeamCard
            team={team("video")}
            onSelect={handleTeamClick}
            breakpoint="desktop"
            className="col-span-1"
          />
        </div>
      </div>
    </div>
  );
}
