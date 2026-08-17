import React from "react";
import type { TeamData } from "../../lib/teams";

interface TeamCardProps {
  team: TeamData;
  onSelect: (teamName: string) => void;
  /** Extra classes for the outer wrapper (e.g. col-span utilities on desktop) */
  className?: string;
  /** "mobile" uses heightMobile on each silhouette; "desktop" uses heightDesktop */
  breakpoint: "mobile" | "desktop";
  /** Tailwind text-size + weight classes for the heading, since mobile/desktop differ */
  headingClassName: string;
}

export default function TeamCard({
  team,
  onSelect,
  className = "",
  breakpoint,
  headingClassName,
}: TeamCardProps) {
  return (
    <div
      onClick={() => onSelect(team.name)}
      className={`group flex cursor-pointer flex-col items-center transition-transform duration-200 select-none active:scale-95 ${className}`}
    >
      <h3
        className={`font-noto-sans mb-2 text-center text-[#000024] transition-transform duration-200 group-hover:scale-105 ${headingClassName}`}
      >
        {team.name}
      </h3>
      <div className="flex items-end justify-center gap-1 lg:gap-3">
        {team.silhouettes.map((s) => {
          const height =
            breakpoint === "mobile" ? s.heightMobile : s.heightDesktop;
          return (
            <img
              key={s.alt}
              src={s.src}
              alt={s.alt}
              style={{ height: `${height}px` }}
              className="object-contain object-bottom transition-transform duration-200 group-hover:scale-105"
            />
          );
        })}
      </div>
    </div>
  );
}
