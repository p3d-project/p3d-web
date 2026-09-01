import { useState, useEffect } from "react";
import {
  TEAMS,
  TEAM_SELECTED_EVENT,
  type Silhouette,
  type TeamData,
} from "../../lib/teams";
import ArrowIcon from "./ArrowIcon";
import cogSvgUrl from "../../assets/Cog.svg?url";

const COG_VIEWBOX = 3400;
const DEGREES_PER_STEP = 60; // 6 teeth on the cog = 60° per step

/** Convert a Cog.svg coordinate to a percentage of the cog container. */
function cogPct(value: number): string {
  return `${(value / COG_VIEWBOX) * 100}%`;
}

/**
 * Anchor points:
 * Adjustments for description and arched text aligned to outer cog sweep.
 */
const COG_ANCHORS = {
  mobile: {
    descCenter: { x: 1400, y: 700 },
    titleCenter: { x: 1265, y: 270 },
  },
  desktop: {
    descCenter: { x: 1390, y: 730 },
    titleCenter: { x: 1300, y: 280 },
    silhouettes: { x: 580, y: 900 },
  },
} as const;

/** Light-blue circle diameter in Cog.svg ≈ 748 px. */
const DESC_CIRCLE_PCT = (748 / COG_VIEWBOX) * 100;

function silhouetteSrc(sil: Silhouette): string {
  return typeof sil.src === "string" ? sil.src : sil.src.src;
}

function getSilhouetteAdjustments(team: TeamData) {
  const isTrio = team.silhouettesBlue.length === 3;
  const isPair = team.silhouettesBlue.length > 1 && !isTrio;

  return team.silhouettesBlue.map((sil, index) => {
    const altLower = sil.alt.toLowerCase();
    let scaleMultiplier = isTrio ? 1.77 : 2.2;
    // Nudged non-trios further left
    let translateX = isTrio ? -130 : -75;

    if (altLower.includes("fuuka")) {
      scaleMultiplier = isTrio ? 1.87 : 2.3;
      translateX -= 30;
    } else if (altLower.includes("aigis")) {
      scaleMultiplier = isTrio ? 1.87 : 2.3;
      translateX -= 25;
    } else if (altLower.includes("yukari")) {
      scaleMultiplier = isTrio ? 1.87 : 2.3;
      translateX -= 20;
    } else if (altLower.includes("ken") || altLower.includes("koromaru")) {
      translateX -= 20;
    }

    if (isPair && index === 1) {
      translateX += 45;
    }

    if (isTrio) {
      if (index === 0) {
        translateX += 15;
      } else if (index === 2) {
        translateX -= 25;
      }
    }

    return { sil, scaleMultiplier, translateX };
  });
}

function TeamSilhouettes({ team }: { team: TeamData }) {
  const isTrio = team.silhouettesBlue.length === 3;
  const isMultiple = team.silhouettesBlue.length > 1;
  const isPair = isMultiple && !isTrio;
  const marginClass = isPair ? "-mr-48" : isMultiple ? "-mr-40" : "-mr-16";

  return (
    <div className="flex items-end justify-start">
      {getSilhouetteAdjustments(team).map(
        ({ sil, scaleMultiplier, translateX }) => (
          <img
            key={sil.alt}
            src={silhouetteSrc(sil)}
            alt={sil.alt}
            style={{
              height: `${sil.heightDesktop * scaleMultiplier}px`,
              transform: `translateX(${translateX}px)`,
            }}
            className={`relative z-10 ${marginClass} w-auto object-contain last:mr-0`}
          />
        ),
      )}
    </div>
  );
}

function ArchedTeamName({ name }: { name: string }) {
  const id = `team-arc-${name.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <svg
      viewBox="0 -45 800 190"
      className="h-[105px] w-[min(70vw,600px)] lg:h-[160px] lg:w-[780px]"
      aria-hidden="true"
    >
      <defs>
        <path id={id} d="M 20 135 A 1350 1350 0 0 1 780 135" fill="none" />
      </defs>
      <text
        fill="#002C48"
        stroke="#79CEFF"
        strokeWidth="8"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{
          fontFamily: "var(--font-noto-sans)",
          fontWeight: 900,
          fontSize: 114,
          letterSpacing: "0.08em",
          paintOrder: "stroke fill",
        }}
      >
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
          {name.toUpperCase()}
        </textPath>
      </text>
    </svg>
  );
}

function FlatTeamName({ name }: { name: string }) {
  return (
    <p
      className="font-noto-sans text-[clamp(2.55rem,11vw,4rem)] font-black tracking-[0.07em] whitespace-nowrap uppercase"
      style={{
        WebkitTextStroke: "5px #79CEFF",
        color: "#002C48",
        paintOrder: "stroke fill",
      }}
    >
      {name}
    </p>
  );
}

type AnimPhase = "settled" | "exiting" | "entering";

function getTransformAndOpacity(
  animPhase: AnimPhase,
  direction: 1 | -1,
  type: "content" | "desc" | "mobileTitle",
) {
  const rotExiting = direction * 12;
  const rotEntering = -direction * 12;

  const transExiting =
    direction * (type === "content" ? 25 : type === "mobileTitle" ? 30 : 15);
  const transEntering =
    -direction * (type === "content" ? 25 : type === "mobileTitle" ? 30 : 15);

  if (animPhase === "exiting") {
    if (type === "mobileTitle") {
      return {
        opacity: 0,
        transform: `translate3d(${transExiting}px, 0, 0)`,
        transition: "all 350ms ease-in-out 15ms",
      };
    }
    return {
      opacity: 0,
      transform:
        type === "content"
          ? `translate3d(${transExiting}px, 0, 0) rotate(${rotExiting}deg)`
          : `translate3d(0, ${transExiting}px, 0) scale(0.97) rotate(${rotExiting * 0.5}deg)`,
      transition: "all 350ms ease-in-out 15ms",
    };
  }

  if (animPhase === "entering") {
    if (type === "mobileTitle") {
      return {
        opacity: 0,
        transform: `translate3d(${transEntering}px, 0, 0)`,
        transition: "none",
      };
    }
    return {
      opacity: 0,
      transform:
        type === "content"
          ? `translate3d(${transEntering}px, 0, 0) rotate(${rotEntering}deg)`
          : `translate3d(0, ${transEntering}px, 0) scale(0.97) rotate(${rotEntering * 0.5}deg)`,
      transition: "none",
    };
  }

  if (type === "mobileTitle") {
    return {
      opacity: 1,
      transform: `translate3d(0px, 0px, 0px)`,
      transition: "all 350ms ease-in-out 15ms",
    };
  }

  return {
    opacity: 1,
    transform:
      type === "content"
        ? `translate3d(0px, 0px, 0px) rotate(0deg)`
        : `translate3d(0px, 0px, 0px) scale(1) rotate(0deg)`,
    transition: "all 350ms ease-in-out 15ms",
  };
}

function MobileDescription({
  team,
  animPhase,
  direction,
}: {
  team: TeamData;
  animPhase: AnimPhase;
  direction: 1 | -1;
}) {
  const { descCenter } = COG_ANCHORS.mobile;
  const style = getTransformAndOpacity(animPhase, direction, "desc");

  return (
    <div
      className="pointer-events-auto absolute z-[2] flex items-center justify-center lg:hidden"
      style={{
        left: cogPct(descCenter.x),
        top: cogPct(descCenter.y),
        width: `${DESC_CIRCLE_PCT * 0.78}%`,
        aspectRatio: "1 / 1.35",
        transform: "translate(-50%, -50%) rotate(-17deg)",
      }}
    >
      <div
        className="flex h-full w-full items-center justify-center text-center font-serif text-black"
        style={style}
      >
        <p className="text-[0.95rem] leading-[1.2] md:text-[1.15rem]">
          {team.description}
        </p>
      </div>
    </div>
  );
}

function DesktopDescription({
  team,
  animPhase,
  direction,
}: {
  team: TeamData;
  animPhase: AnimPhase;
  direction: 1 | -1;
}) {
  const { descCenter } = COG_ANCHORS.desktop;
  const style = getTransformAndOpacity(animPhase, direction, "desc");

  return (
    <div
      className="pointer-events-auto absolute z-[2] hidden items-center justify-center lg:flex"
      style={{
        left: cogPct(descCenter.x),
        top: cogPct(descCenter.y),
        width: `${DESC_CIRCLE_PCT * 0.78}%`,
        aspectRatio: "1 / 1.35",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        className="flex h-full w-full items-center justify-center text-center font-serif text-black"
        style={style}
      >
        <p className="text-2xl leading-relaxed">{team.description}</p>
      </div>
    </div>
  );
}

function StaticTeamContent({
  team,
  animPhase,
  direction,
}: {
  team: TeamData;
  animPhase: AnimPhase;
  direction: 1 | -1;
}) {
  const { desktop } = COG_ANCHORS;
  const style = getTransformAndOpacity(animPhase, direction, "content");

  return (
    <div className="pointer-events-none absolute inset-0 z-[1]" style={style}>
      {/* Desktop — arched title */}
      <div
        className="pointer-events-none absolute hidden lg:block"
        style={{
          left: cogPct(desktop.titleCenter.x),
          top: cogPct(desktop.titleCenter.y),
          transform: "translate(-50%, -50%) rotate(-15deg)",
        }}
      >
        <ArchedTeamName name={team.name} />
      </div>

      {/* Desktop silhouettes — left of the cog */}
      <div
        className="pointer-events-none absolute hidden lg:block"
        style={{
          left: cogPct(desktop.silhouettes.x),
          top: cogPct(desktop.silhouettes.y),
          transform: "translate(-28%, -100%)",
        }}
      >
        <TeamSilhouettes team={team} />
      </div>
    </div>
  );
}

export default function TeamCarousel() {
  const [step, setStep] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [buttonIndex, setButtonIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [animPhase, setAnimPhase] = useState<AnimPhase>("settled");
  const [isAnimating, setIsAnimating] = useState(false);

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

  const currentTeam = TEAMS[activeIndex];
  const prevTeam = TEAMS[(buttonIndex - 1 + TEAMS.length) % TEAMS.length];
  const nextTeam = TEAMS[(buttonIndex + 1) % TEAMS.length];

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(-1);
    setStep((s) => s - 1);
    setButtonIndex((prev) => (prev - 1 + TEAMS.length) % TEAMS.length);
    setAnimPhase("exiting");

    setTimeout(() => {
      setActiveIndex((prev) => (prev - 1 + TEAMS.length) % TEAMS.length);
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
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(1);
    setStep((s) => s + 1);
    setButtonIndex((prev) => (prev + 1) % TEAMS.length);
    setAnimPhase("exiting");

    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % TEAMS.length);
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
  };

  const rotation = step * DEGREES_PER_STEP;

  const finalCogSrc =
    typeof cogSvgUrl === "string" ? cogSvgUrl : (cogSvgUrl as any).src;

  return (
    <div className="relative mt-8 flex min-h-[620px] w-full flex-col items-center overflow-hidden pt-6 pb-8 md:mt-4 md:min-h-[750px] md:pt-2 lg:mt-12 lg:min-h-[1150px] lg:pt-12 lg:pb-48">
      <style>{`
        @keyframes teamTextFade {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Navigation buttons */}
      <div className="p3d-container relative z-10 my-2 flex w-full items-center justify-between md:my-1 lg:mt-4 lg:mb-250">
        <button
          type="button"
          onClick={handlePrev}
          disabled={isAnimating}
          aria-label={`Go to ${prevTeam.name}`}
          className="group inline-flex cursor-pointer items-center gap-2 bg-transparent transition-all duration-300 hover:-translate-x-2 disabled:cursor-not-allowed disabled:opacity-40 sm:gap-3"
        >
          <div className="text-secondary h-8 w-8 rotate-90 transition-transform duration-300 group-hover:scale-115 sm:h-12 sm:w-12">
            <ArrowIcon className="h-full w-full" />
          </div>
          <span
            key={prevTeam.name}
            style={{ animation: "teamTextFade 0.4s ease-in-out" }}
            className="font-noto-sans text-secondary inline-block text-base font-bold sm:text-2xl"
          >
            {prevTeam.name}
          </span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={isAnimating}
          aria-label={`Go to ${nextTeam.name}`}
          className="group inline-flex cursor-pointer items-center gap-2 bg-transparent transition-all duration-300 hover:translate-x-2 disabled:cursor-not-allowed disabled:opacity-40 sm:gap-3"
        >
          <span
            key={nextTeam.name}
            style={{ animation: "teamTextFade 0.4s ease-in-out" }}
            className="font-noto-sans text-secondary inline-block text-base font-bold sm:text-2xl"
          >
            {nextTeam.name}
          </span>
          <div className="text-secondary h-8 w-8 -rotate-90 transition-transform duration-300 group-hover:scale-115 sm:h-12 sm:w-12">
            <ArrowIcon className="h-full w-full" />
          </div>
        </button>
      </div>

      {/* Dedicated Tablet / Mobile Title Container with clean separation and clearance */}
      <div className="pointer-events-none relative z-10 mt-4 mb-2 flex w-full justify-center md:mt-5 md:mb-4 lg:hidden">
        <div
          style={getTransformAndOpacity(animPhase, direction, "mobileTitle")}
        >
          <FlatTeamName name={currentTeam.name} />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Absolute Cog Positioning: */}
        <div className="absolute -bottom-[960px] left-1/2 mb-8 h-[1400px] w-[1400px] -translate-x-1/2 md:-bottom-[1700px] md:h-[2450px] md:w-[2450px] lg:top-[157%] lg:right-0 lg:h-[4150px] lg:w-[4150px] lg:translate-x-[-34%] lg:-translate-y-1/2">
          <div className="relative h-full w-full rotate-[17deg] lg:rotate-0">
            {/* Rotating Cog Wheel Background Only */}
            <div
              className="relative h-full w-full transition-transform duration-700 ease-in-out motion-reduce:transition-none"
              style={{
                transform: `translate3d(0, 0, 0) rotate(${rotation}deg)`,
                willChange: "transform",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
            >
              <img
                src={finalCogSrc}
                alt=""
                aria-hidden="true"
                style={{
                  willChange: "transform",
                  transform: "translate3d(0, 0, 0)",
                  backfaceVisibility: "hidden",
                  contain: "strict",
                }}
                className="pointer-events-none absolute inset-0 z-0 h-full w-full object-contain"
              />
            </div>

            {/* Content with Perfectly Synced Spin Illusion */}
            <StaticTeamContent
              team={currentTeam}
              animPhase={animPhase}
              direction={direction}
            />
            <MobileDescription
              team={currentTeam}
              animPhase={animPhase}
              direction={direction}
            />
            <DesktopDescription
              team={currentTeam}
              animPhase={animPhase}
              direction={direction}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * PERFORMANCE NOTE: TEAM CAROUSEL GPU ACCELERATION
 * - Uses an `<img>` tag instead of inline SVG so the browser rasterizes
 *   the large asset (3450px) into a static GPU texture once.
 * - Hardware acceleration flags (`translate3d`, `willChange`, `contain: strict`,
 *   `backface-visibility`, `transformStyle`) prevent Firefox from falling back
 *   to sluggish CPU software rendering on large elements.
 *
 * DO NOT REMOVE these styles—removing them reintroduces severe frame stuttering.
 */
