import { useState, useEffect, useRef } from "react";
import { TEAMS, TEAM_SELECTED_EVENT, type Silhouette, type TeamData } from "../../lib/teams";
import arrowSvg from "../../assets/Arrow-7.svg?raw";
import cogSvg from "../../assets/Cog.svg?url";

const SPIN_DURATION_MS = 700;
const COG_VIEWBOX = 3400;

/** Convert a Cog.svg coordinate to a percentage of the cog container. */
function cogPct(value: number): string {
  return `${(value / COG_VIEWBOX) * 100}%`;
}

/**
 * Anchor points:
 * - Mobile: Reverted back to original setup.
 * - Desktop: Upper-left band of the cog for title/description.
 */
const COG_ANCHORS = {
  mobile: {
    descCenter: { x: 1400, y: 700 },
    titleCenter: { x: 1265, y: 290 },
  },
  desktop: {
    descCenter: { x: 1390, y: 730 },
    titleCenter: { x: 1300, y: 300 },
    silhouettes: { x: 450, y: 900 },
  },
} as const;

/** Light-blue circle diameter in Cog.svg ≈ 748 px. */
const DESC_CIRCLE_PCT = (748 / COG_VIEWBOX) * 100;

function silhouetteSrc(sil: Silhouette): string {
  return typeof sil.src === "string" ? sil.src : sil.src.src;
}

function getSilhouetteAdjustments(team: TeamData) {
  const isTrio = team.silhouettesBlue.length === 3;

  return team.silhouettesBlue.map((sil) => {
    const altLower = sil.alt.toLowerCase();
    let scaleMultiplier = isTrio ? 1.3 : 1.55;
    let translateX = 0;

    if (isTrio) translateX -= 140;

    if (altLower.includes("fuuka")) {
      scaleMultiplier = isTrio ? 1.42 : 1.68;
      translateX -= 35;
    } else if (altLower.includes("aigis")) {
      scaleMultiplier = isTrio ? 1.4 : 1.65;
      translateX -= 30;
    } else if (altLower.includes("yukari")) {
      scaleMultiplier = isTrio ? 1.4 : 1.65;
      translateX -= 25;
    } else if (altLower.includes("ken") || altLower.includes("koromaru")) {
      translateX -= 25;
    }

    return { sil, scaleMultiplier, translateX };
  });
}

function TeamSilhouettes({ team }: { team: TeamData }) {
  const isTrio = team.silhouettesBlue.length === 3;
  const isMultiple = team.silhouettesBlue.length > 1;
  const marginClass = isMultiple && !isTrio ? "-mr-24" : "-mr-16";

  return (
    <div className="flex items-end justify-start">
      {getSilhouetteAdjustments(team).map(({ sil, scaleMultiplier, translateX }) => (
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
      ))}
    </div>
  );
}

function ArchedTeamName({ name }: { name: string }) {
  const id = `team-arc-${name.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <svg
      viewBox="0 -25 720 150"
      className="h-[72px] w-[min(50vw,460px)] lg:h-[110px] lg:w-[540px]"
      aria-hidden="true"
    >
      <defs>
        <path id={id} d="M 30 120 Q 360 10 690 120" fill="none" />
      </defs>
      <text
        fill="#002C48"
        stroke="#79CEFF"
        strokeWidth="4.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{
          fontFamily: "var(--font-noto-sans)",
          fontWeight: 900,
          fontSize: 78,
          letterSpacing: "0.06em",
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
      className="font-noto-sans whitespace-nowrap text-[clamp(2rem,10vw,3rem)] font-black uppercase tracking-[0.06em]"
      style={{ 
        WebkitTextStroke: '4px #79CEFF',
        color: '#002C48',
        paintOrder: 'stroke fill'
      }}
    >
      {name}
    </p>
  );
}

function MobileDescription({ team, opacity }: { team: TeamData; opacity: number }) {
  const { descCenter } = COG_ANCHORS.mobile;

  return (
    <div
      className="pointer-events-auto absolute z-[2] flex items-center justify-center transition-opacity duration-300 ease-in-out lg:hidden"
      style={{
        left: cogPct(descCenter.x),
        top: cogPct(descCenter.y),
        width: `${DESC_CIRCLE_PCT * 0.78}%`,
        aspectRatio: "1 / 1.35",
        transform: "translate(-50%, -50%) rotate(-17deg)",
        opacity,
      }}
    >
      <div className="font-serif flex h-full w-full items-center justify-center text-center text-black">
        <p className="text-[1.2rem] leading-[1.25]">
          {team.description}
        </p>
      </div>
    </div>
  );
}

function SpinningTeamContent({
  team,
  phase,
  spinDeg,
  direction,
}: {
  team: TeamData;
  phase: "enter" | "exit" | "idle";
  spinDeg: number;
  direction: number;
}) {
  const animationClass =
    phase === "enter" ? "team-spin-in" : phase === "exit" ? "team-spin-out-fast" : "";

  const { mobile, desktop } = COG_ANCHORS;

  return (
    <div
      className={`absolute inset-0 z-[1] ${animationClass}`}
      style={
        {
          "--spin-deg": `${spinDeg}deg`,
          "--spin-dir": direction,
          ...(phase === "idle" ? { opacity: 1, transform: "rotate(0deg)" } : {}),
        } as React.CSSProperties
      }
    >
      {/* Mobile — flat title */}
      <div
        className="pointer-events-none absolute lg:hidden"
        style={{
          left: cogPct(mobile.titleCenter.x),
          top: cogPct(mobile.titleCenter.y),
          transform: "translate(-50%, -50%) rotate(-17deg)",
        }}
      >
        <FlatTeamName name={team.name} />
      </div>

      {/* Desktop — arched title */}
      <div
        className="pointer-events-none absolute hidden lg:block"
        style={{
          left: cogPct(desktop.titleCenter.x),
          top: cogPct(desktop.titleCenter.y),
          transform: "translate(-50%, -50%) rotate(-12deg)",
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
          transform: "translate(-20%, -100%)",
        }}
      >
        <TeamSilhouettes team={team} />
      </div>
    </div>
  );
}

function DesktopDescription({ team, opacity }: { team: TeamData; opacity: number }) {
  const { descCenter } = COG_ANCHORS.desktop;

  return (
    <div
      className="pointer-events-auto absolute z-[2] hidden items-center justify-center transition-opacity duration-300 ease-in-out lg:flex"
      style={{
        left: cogPct(descCenter.x),
        top: cogPct(descCenter.y),
        width: `${DESC_CIRCLE_PCT * 0.78}%`,
        aspectRatio: "1 / 1.35",
        transform: "translate(-50%, -50%)",
        opacity,
      }}
    >
      <div className="font-serif flex h-full w-full items-center justify-center text-center text-black">
        <p className="text-xl leading-relaxed">
          {team.description}
        </p>
      </div>
    </div>
  );
}

export default function TeamCarousel() {
  const [step, setStep] = useState(0);
  const [displayStep, setDisplayStep] = useState(0);
  const [outgoingStep, setOutgoingStep] = useState<number | null>(null);
  const [spinDeg, setSpinDeg] = useState(60);
  const [direction, setDirection] = useState(1);
  const [descOpacity, setDescOpacity] = useState(1);
  const visibleStepRef = useRef(0);

  useEffect(() => {
    const handleTeamSelected = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const selectedTeamId = customEvent.detail;

      const targetIndex = TEAMS.findIndex((t) => t.id === selectedTeamId);
      if (targetIndex !== -1) {
        setStep((prev) => {
          const currentIndex = ((prev % TEAMS.length) + TEAMS.length) % TEAMS.length;
          let diff = targetIndex - currentIndex;

          if (diff > 3) diff -= TEAMS.length;
          if (diff < -3) diff += TEAMS.length;

          return prev + diff;
        });
      }
    };

    window.addEventListener(TEAM_SELECTED_EVENT, handleTeamSelected);
    return () => window.removeEventListener(TEAM_SELECTED_EVENT, handleTeamSelected);
  }, []);

  useEffect(() => {
    if (step === visibleStepRef.current) return;

    const diff = step - visibleStepRef.current;
    const dir = Math.sign(diff);
    const degrees = Math.abs(diff) * 60;

    setDirection(dir);
    setSpinDeg(degrees);
    setOutgoingStep(visibleStepRef.current);
    setDescOpacity(0);

    const timer = window.setTimeout(() => {
      visibleStepRef.current = step;
      setDisplayStep(step);
      setOutgoingStep(null);
      setDescOpacity(1);
    }, SPIN_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [step]);

  const activeIndex = ((step % TEAMS.length) + TEAMS.length) % TEAMS.length;
  const displayIndex = ((displayStep % TEAMS.length) + TEAMS.length) % TEAMS.length;
  const outgoingIndex =
    outgoingStep === null
      ? null
      : ((outgoingStep % TEAMS.length) + TEAMS.length) % TEAMS.length;

  const currentTeam = TEAMS[activeIndex];
  const displayTeam = TEAMS[displayIndex];
  const outgoingTeam = outgoingIndex !== null ? TEAMS[outgoingIndex] : null;
  const prevTeam = TEAMS[(activeIndex - 1 + TEAMS.length) % TEAMS.length];
  const nextTeam = TEAMS[(activeIndex + 1) % TEAMS.length];

  const handlePrev = () => setStep((prev) => prev - 1);
  const handleNext = () => setStep((prev) => prev + 1);

  const rotation = step * 60;
  const isTransitioning = outgoingStep !== null;

  return (
    <div className="relative flex min-h-[820px] w-full flex-col items-center overflow-hidden pt-6 pb-12 sm:pt-20">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Cog container */}
        <div className="absolute h-[2100px] w-[2100px] -bottom-[1420px] left-1/2 -translate-x-1/2 lg:top-[152%] lg:right-0 lg:h-[2375px] lg:w-[2375px] lg:translate-x-[-26%] lg:-translate-y-1/2">
          {/* Mobile 17° tilt */}
          <div className="relative h-full w-full rotate-[17deg] lg:rotate-0">
            <div
              className="relative h-full w-full transition-transform duration-700 ease-in-out motion-reduce:transition-none"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <img src={cogSvg} alt="" className="absolute inset-0 z-0 h-full w-full object-contain" />
            </div>

            <div className="absolute inset-0" style={{ transformOrigin: "50% 50%" }}>
              {isTransitioning && outgoingTeam && (
                <SpinningTeamContent
                  team={outgoingTeam}
                  phase="exit"
                  spinDeg={spinDeg}
                  direction={direction}
                />
              )}
              <SpinningTeamContent
                team={isTransitioning ? currentTeam : displayTeam}
                phase={isTransitioning ? "enter" : "idle"}
                spinDeg={spinDeg}
                direction={direction}
              />
            </div>

            <MobileDescription team={displayTeam} opacity={descOpacity} />
            <DesktopDescription team={displayTeam} opacity={descOpacity} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes teamSpinOutFast {
          0% {
            opacity: 1;
            transform: rotate(0deg);
          }
          40% {
            opacity: 0;
          }
          100% {
            opacity: 0;
            transform: rotate(calc(var(--spin-deg) * var(--spin-dir)));
          }
        }

        @keyframes teamSpinIn {
          from {
            opacity: 0;
            transform: rotate(calc(var(--spin-deg) * var(--spin-dir) * -1));
          }
          to {
            opacity: 1;
            transform: rotate(0deg);
          }
        }

        .team-spin-out-fast {
          animation: teamSpinOutFast ${SPIN_DURATION_MS}ms ease-in-out forwards;
          transform-origin: 50% 50%;
        }

        .team-spin-in {
          animation: teamSpinIn ${SPIN_DURATION_MS}ms ease-in-out forwards;
          transform-origin: 50% 50%;
        }

        @media (prefers-reduced-motion: reduce) {
          .team-spin-out-fast,
          .team-spin-in {
            animation: none;
          }
        }
      `}</style>

      {/* Paginator buttons container */}
      <div className="relative z-10 mb-20 sm:mb-12 flex w-full max-w-[1500px] items-center justify-between px-6 pt-0 sm:pt-2 sm:px-12">
        <button
          type="button"
          onClick={handlePrev}
          aria-label={`Go to ${prevTeam.name}`}
          className="group inline-flex cursor-pointer items-center gap-3 bg-transparent transition-all duration-300 hover:-translate-x-2"
        >
          <div
            className="h-12 w-12 rotate-90 transition-transform duration-300 group-hover:scale-110 [&>svg]:h-full [&>svg]:w-full [&>svg_*]:!fill-secondary [&>svg_*]:!stroke-secondary"
            dangerouslySetInnerHTML={{ __html: arrowSvg }}
          />
          <span className="font-noto-sans text-lg font-bold text-secondary sm:text-2xl">{prevTeam.name}</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label={`Go to ${nextTeam.name}`}
          className="group inline-flex cursor-pointer items-center gap-3 bg-transparent transition-all duration-300 hover:translate-x-2"
        >
          <span className="font-noto-sans text-lg font-bold text-secondary sm:text-2xl">{nextTeam.name}</span>
          <div
            className="h-12 w-12 -rotate-90 transition-transform duration-300 group-hover:scale-110 [&>svg]:h-full [&>svg]:w-full [&>svg_*]:!fill-secondary [&>svg_*]:!stroke-secondary"
            dangerouslySetInnerHTML={{ __html: arrowSvg }}
          />
        </button>
      </div>
    </div>
  );
}