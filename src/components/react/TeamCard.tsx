import { cn } from "../../lib/utils";
import type { TeamData } from "../../lib/teams";

/** Default heading styles when headingClassName is not passed. */
const DEFAULT_HEADING_CLASS: Record<"mobile" | "desktop", string> = {
  mobile: "text-base sm:text-lg font-black",
  desktop: "text-xl lg:text-2xl font-black",
};

interface TeamCardProps {
  team: TeamData;
  onSelect: (teamId: string) => void;
  /** Optional wrapper classes (e.g. col-span on desktop). */
  className?: string;
  /** Which silhouette heights to use — mobile or desktop. */
  breakpoint: "mobile" | "desktop";
  /** Optional heading overrides; defaults per breakpoint otherwise. */
  headingClassName?: string;
}

/** Single team entry in the hero grid. Dispatches team.id to the parent on click. */
export default function TeamCard({
  team,
  onSelect,
  className = "",
  breakpoint,
  headingClassName,
}: TeamCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(team.id)}
      aria-label={`View ${team.name} team`}
      className={cn(
        "group flex cursor-pointer flex-col items-center border-0 bg-transparent p-0 transition-transform duration-200 select-none active:scale-95",
        className,
      )}
    >
      <h3
        className={cn(
          "font-noto-sans mb-2 text-center text-[#000024] transition-transform duration-200 group-hover:scale-105",
          headingClassName ?? DEFAULT_HEADING_CLASS[breakpoint],
        )}
      >
        {team.name}
      </h3>
      <div className="flex flex-shrink-0 items-end justify-center gap-1 lg:gap-3">
        {team.silhouettes.map((s) => {
          const height =
            breakpoint === "mobile" ? s.heightMobile : s.heightDesktop;
          return (
            <img
              key={s.alt}
              src={s.src}
              alt={s.alt}
              style={{ height: `${height}px` }}
              className="w-auto max-w-none flex-shrink-0 object-contain object-bottom transition-transform duration-200 group-hover:scale-105"
            />
          );
        })}
      </div>
    </button>
  );
}
