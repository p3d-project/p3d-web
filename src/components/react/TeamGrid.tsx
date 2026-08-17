import React, { useState } from "react";
import TeamCard from "./TeamCard";
import { TEAMS } from "../../lib/teams";

export default function TeamGrid() {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const handleTeamClick = (teamName: string) => {
    setSelectedTeam(teamName);
    const targetSection = document.getElementById("team");
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const byId = (id: string) => TEAMS.find((t) => t.id === id)!;

  return (
    <div className="flex h-full w-full flex-col justify-center">
      {/* MOBILE LAYOUT (< lg) */}
      <div className="flex w-full flex-col gap-8 px-1 py-4 sm:gap-10 lg:hidden">
        {/* Row 1: Game Dev | Web Dev | UX/UI */}
        <div className="grid w-full grid-cols-3 items-end justify-items-center gap-1 sm:gap-3">
          <TeamCard
            team={byId("game-dev")}
            onSelect={handleTeamClick}
            breakpoint="mobile"
            headingClassName="text-base sm:text-lg font-black"
          />
          <TeamCard
            team={byId("web-dev")}
            onSelect={handleTeamClick}
            breakpoint="mobile"
            headingClassName="text-base sm:text-lg font-black"
          />
          <TeamCard
            team={byId("ux-ui")}
            onSelect={handleTeamClick}
            breakpoint="mobile"
            headingClassName="text-base sm:text-lg font-black"
          />
        </div>

        {/* Row 2: Graphics */}
        <TeamCard
          team={byId("graphics")}
          onSelect={handleTeamClick}
          breakpoint="mobile"
          className="w-full"
          headingClassName="text-base sm:text-lg font-black"
        />

        {/* Row 3: Music | 3D | Video */}
        <div className="grid w-full grid-cols-3 items-end justify-items-center gap-1 sm:gap-3">
          <TeamCard
            team={byId("music")}
            onSelect={handleTeamClick}
            breakpoint="mobile"
            headingClassName="text-base sm:text-lg font-black"
          />
          <TeamCard
            team={byId("3d")}
            onSelect={handleTeamClick}
            breakpoint="mobile"
            headingClassName="text-base sm:text-lg font-black"
          />
          <TeamCard
            team={byId("video")}
            onSelect={handleTeamClick}
            breakpoint="mobile"
            headingClassName="text-base sm:text-lg font-black"
          />
        </div>
      </div>

      {/* DESKTOP LAYOUT (>= lg) */}
      <div className="hidden w-full flex-col justify-center gap-12 py-4 pr-2 pl-0 lg:flex lg:gap-16">
        {/* Top Row: Game Dev | Web Dev | UX/UI | 3D */}
        <div className="grid w-full grid-cols-4 items-end justify-items-center gap-4 lg:gap-8">
          <TeamCard
            team={byId("game-dev")}
            onSelect={handleTeamClick}
            breakpoint="desktop"
            headingClassName="text-xl lg:text-2xl font-black"
          />
          <TeamCard
            team={byId("web-dev")}
            onSelect={handleTeamClick}
            breakpoint="desktop"
            headingClassName="text-xl lg:text-2xl font-black"
          />
          <TeamCard
            team={byId("ux-ui")}
            onSelect={handleTeamClick}
            breakpoint="desktop"
            headingClassName="text-xl lg:text-2xl font-black"
          />
          <TeamCard
            team={byId("3d")}
            onSelect={handleTeamClick}
            breakpoint="desktop"
            headingClassName="text-xl lg:text-2xl font-black"
          />
        </div>

        {/* Bottom Row: Graphics (2 cols) | Music | Video */}
        <div className="grid w-full grid-cols-4 items-end justify-items-center gap-4 lg:gap-8">
          <TeamCard
            team={byId("graphics")}
            onSelect={handleTeamClick}
            breakpoint="desktop"
            className="col-span-2"
            headingClassName="text-xl lg:text-2xl font-black"
          />
          <TeamCard
            team={byId("music")}
            onSelect={handleTeamClick}
            breakpoint="desktop"
            className="col-span-1"
            headingClassName="text-xl lg:text-2xl font-black"
          />
          <TeamCard
            team={byId("video")}
            onSelect={handleTeamClick}
            breakpoint="desktop"
            className="col-span-1"
            headingClassName="text-xl lg:text-2xl font-black"
          />
        </div>
      </div>
    </div>
  );
}
