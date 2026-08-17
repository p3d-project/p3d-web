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
    <div className="w-full h-full flex flex-col justify-center">
      {/* MOBILE LAYOUT (< lg) */}
      <div className="flex flex-col gap-8 sm:gap-10 w-full py-4 px-1 lg:hidden">
        {/* Row 1: Game Dev | Web Dev | UX/UI */}
        <div className="grid grid-cols-3 gap-1 sm:gap-3 items-end justify-items-center w-full">
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
        <div className="grid grid-cols-3 gap-1 sm:gap-3 items-end justify-items-center w-full">
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
      <div className="hidden lg:flex flex-col justify-center gap-12 lg:gap-16 py-4 pr-2 pl-0 w-full">
        {/* Top Row: Game Dev | Web Dev | UX/UI | 3D */}
        <div className="grid grid-cols-4 gap-4 lg:gap-8 items-end justify-items-center w-full">
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
        <div className="grid grid-cols-4 gap-4 lg:gap-8 items-end justify-items-center w-full">
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
