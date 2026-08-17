import { useState, useEffect } from "react";
import { TEAMS, TEAM_SELECTED_EVENT, type Silhouette } from "../../lib/teams";
import arrowSvg from "../../assets/Arrow-7.svg?raw";

/** Team detail carousel. Subscribes to TEAM_SELECTED_EVENT from TeamGrid. */
export default function TeamCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  /** Listen for team selection dispatched by the hero grid. */
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
    return () =>
      window.removeEventListener(TEAM_SELECTED_EVENT, handleTeamSelected);
  }, []);

  const currentTeam = TEAMS[currentIndex];
  const prevTeam = TEAMS[(currentIndex - 1 + TEAMS.length) % TEAMS.length];
  const nextTeam = TEAMS[(currentIndex + 1) % TEAMS.length];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TEAMS.length) % TEAMS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TEAMS.length);
  };

  return (
    <div className="flex w-full flex-col items-center">
      {/* Entrance animation for silhouettes — scoped here until moved to global.css. */}
      <style>{`
        @keyframes smoothEnter {
          0% { opacity: 0; transform: translateY(15px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-smooth-enter {
          animation: smoothEnter 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>

      {/* Prev / next team navigation */}
      <div className="mb-12 flex w-full items-center justify-between px-4 sm:px-8">
        <button
          type="button"
          onClick={handlePrev}
          aria-label={`Go to ${prevTeam.name}`}
          className="group inline-flex cursor-pointer items-center gap-3 bg-transparent transition-all duration-300 hover:-translate-x-2"
        >
          <div
            className="[&>svg_*]:!fill-secondary [&>svg_*]:!stroke-secondary h-12 w-12 rotate-90 transition-transform duration-300 group-hover:scale-110 [&>svg]:h-full [&>svg]:w-full"
            dangerouslySetInnerHTML={{ __html: arrowSvg }}
          />
          <span className="font-noto-sans text-secondary text-lg font-bold sm:text-2xl">
            {prevTeam.name}
          </span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label={`Go to ${nextTeam.name}`}
          className="group inline-flex cursor-pointer items-center gap-3 bg-transparent transition-all duration-300 hover:translate-x-2"
        >
          <span className="font-noto-sans text-secondary text-lg font-bold sm:text-2xl">
            {nextTeam.name}
          </span>
          <div
            className="[&>svg_*]:!fill-secondary [&>svg_*]:!stroke-secondary h-12 w-12 -rotate-90 transition-transform duration-300 group-hover:scale-110 [&>svg]:h-full [&>svg]:w-full"
            dangerouslySetInnerHTML={{ __html: arrowSvg }}
          />
        </button>
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 lg:grid-cols-12">
        {/* Desktop silhouettes — hidden on mobile until the carousel layout is complete. */}
        <div className="hidden min-h-[400px] items-center justify-center lg:col-span-5 lg:flex">
          {/*
            key={currentIndex} remounts this wrapper so the enter animation
            replays whenever the active team changes.
          */}
          <div
            key={currentIndex}
            className="animate-smooth-enter flex items-end justify-center gap-4"
          >
            {currentTeam.silhouettes.map((sil: Silhouette) => (
              <img
                key={sil.alt}
                src={sil.src}
                alt={sil.alt}
                style={{ height: `${sil.heightDesktop}px` }}
                className="w-auto object-contain"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
