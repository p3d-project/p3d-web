import { useState, useEffect, useRef } from "react";
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
    descCenter: { x: 1398.6, y: 711.7 },
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

function plainTextFromHtml(value: string): string {
  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return value;
  }

  const doc = new DOMParser().parseFromString(value, "text/html");
  return (doc.body.textContent ?? "").replace(/\s+/g, " ").trim();
}

function sanitizeDescription(value: string): string {
  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return value;
  }

  const doc = new DOMParser().parseFromString(value, "text/html");
  const allowedTags = new Set([
    "P",
    "EM",
    "STRONG",
    "UL",
    "OL",
    "LI",
    "BR",
    "A",
    "SPAN",
    "B",
    "I",
  ]);
  const allowedAttrs = new Set(["href", "target", "rel", "class"]);

  doc.body.querySelectorAll("*").forEach((element) => {
    const tagName = element.tagName.toUpperCase();

    if (!allowedTags.has(tagName)) {
      element.remove();
      return;
    }

    Array.from(element.attributes).forEach((attribute) => {
      const attrName = attribute.name.toLowerCase();

      if (attrName.startsWith("on") || !allowedAttrs.has(attrName)) {
        element.removeAttribute(attribute.name);
        return;
      }

      if (attrName === "href") {
        const href = attribute.value.trim();
        if (href && !href.startsWith("#") && !/^https?:\/\//i.test(href)) {
          element.removeAttribute("href");
        }
      }
    });
  });

  return doc.body.innerHTML;
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

  const marginVw = isPair ? -10 : isMultiple ? -8.333 : -3.333;
  const adjustments = getSilhouetteAdjustments(team);

  return (
    <div className="flex items-end justify-start">
      {adjustments.map(({ sil, scaleMultiplier, translateX }, index) => {
        const isLast = index === adjustments.length - 1;
        return (
          <img
            key={sil.alt}
            src={silhouetteSrc(sil)}
            alt={sil.alt}
            style={{
              height: `${((sil.heightDesktop * scaleMultiplier) / 19.2).toFixed(3)}vw`,
              transform: `translateX(${(translateX / 19.2).toFixed(3)}vw)`,
              marginRight: isLast ? 0 : `${marginVw}vw`,
            }}
            className="relative z-10 w-auto object-contain"
          />
        );
      })}
    </div>
  );
}

function ArchedTeamName({ name }: { name: string }) {
  const id = `team-arc-${name.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <svg
      viewBox="0 -45 800 190"
      className="h-[105px] w-[min(70vw,600px)] md:h-[8.33vw] md:w-[40.625vw]"
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
      className="font-noto-sans text-[4.0625rem] font-black tracking-[0.07em] whitespace-nowrap uppercase"
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
  const descriptionLength = plainTextFromHtml(team.description).length;
  const lengthScale = Math.max(
    0.55,
    Math.min(1, Math.sqrt(240 / Math.max(descriptionLength, 1))),
  );
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [fittedFontSize, setFittedFontSize] = useState<number | null>(null);

  useEffect(() => {
    const descriptionElement = descriptionRef.current;
    const container = descriptionElement?.parentElement;
    if (!descriptionElement || !container) return;
    let disposed = false;

    const fitDescription = () => {
      if (disposed) return;
      if (!container.clientWidth || !container.clientHeight) return;

      let nextFontSize = Math.min(
        16,
        Math.max(6, container.clientWidth * 0.05 * lengthScale),
      );

      descriptionElement.style.fontSize = `${nextFontSize}px`;
      while (
        nextFontSize > 6 &&
        (descriptionElement.scrollWidth > container.clientWidth ||
          descriptionElement.scrollHeight > container.clientHeight)
      ) {
        nextFontSize -= 0.25;
        descriptionElement.style.fontSize = `${nextFontSize}px`;
      }

      setFittedFontSize(nextFontSize);
    };

    fitDescription();
    const observer = new ResizeObserver(fitDescription);
    observer.observe(container);
    const fontsReady = document.fonts?.ready.then(fitDescription);
    return () => {
      disposed = true;
      observer.disconnect();
      void fontsReady;
    };
  }, [descriptionLength]);

  const descriptionFontSize = fittedFontSize
    ? `${fittedFontSize}px`
    : "clamp(6px, 5cqw, 16px)";

  const safeDescription = sanitizeDescription(team.description);

  return (
    <div
      className="pointer-events-auto absolute z-[2] flex items-center justify-center md:hidden"
      style={{
        left: cogPct(descCenter.x),
        top: cogPct(descCenter.y),
        width: `${DESC_CIRCLE_PCT * 0.88}%`,
        aspectRatio: "1 / 1.7",
        transform: "translate(-50%, -50%) rotate(-17deg)",
        borderRadius: "50%",
        overflow: "hidden",
      }}
    >
      <div
        className="flex h-full w-full items-center justify-center text-center font-serif text-black"
        style={style}
      >
        <div
          className="max-h-full min-w-0 max-w-full leading-[1.2] break-words [&_ol]:my-1 [&_ol]:list-inside [&_ol]:list-decimal [&_ol]:pl-0 [&_p]:my-1 [&_ul]:my-1 [&_ul]:list-inside [&_ul]:list-disc [&_ul]:pl-0"
          style={{ fontSize: descriptionFontSize }}
          ref={descriptionRef}
          dangerouslySetInnerHTML={{ __html: safeDescription }}
        />
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
  const safeDescription = sanitizeDescription(team.description);

  return (
    <div
      className="pointer-events-auto absolute z-[2] hidden items-center justify-center md:flex"
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
        <div
          className="text-[clamp(0px,calc(1.5vw-3.5px),24px)] leading-[1.2] [&_ol]:my-2 [&_ol]:list-inside [&_ol]:list-decimal [&_ol]:pl-0 [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-inside [&_ul]:list-disc [&_ul]:pl-0"
          dangerouslySetInnerHTML={{ __html: safeDescription }}
        />
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
        className="pointer-events-none absolute hidden md:block"
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
        className="pointer-events-none absolute hidden md:block"
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
    <div className="relative mt-[7.96vw] flex min-h-[154.23vw] w-full flex-col items-center overflow-hidden pt-[5.97vw] pb-[7.96vw] md:mt-[2.5vw] md:min-h-[59.9vw] md:pt-[2.5vw] md:pb-[10vw]">
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
      <div className="p3d-container relative z-10 my-[1.99vw] flex w-full items-center justify-between md:mt-[0.83vw] md:mb-[52.08vw]">
        <button
          type="button"
          onClick={handlePrev}
          disabled={isAnimating}
          aria-label={`Go to ${prevTeam.name}`}
          className="group inline-flex cursor-pointer items-center gap-[1.99vw] bg-transparent transition-all duration-300 hover:-translate-x-2 disabled:cursor-not-allowed disabled:opacity-40 sm:gap-[1.56vw] md:gap-[0.625vw]"
        >
          <div className="text-secondary h-[7.96vw] w-[7.96vw] rotate-90 transition-transform duration-300 group-hover:scale-115 sm:h-[6.25vw] sm:w-[6.25vw] md:h-[2.5vw] md:w-[2.5vw]">
            <ArrowIcon className="h-full w-full" />
          </div>
          <span
            key={prevTeam.name}
            style={{ animation: "teamTextFade 0.4s ease-in-out" }}
            className="font-noto-sans text-secondary inline-block text-[3.98vw] font-bold sm:text-[3.13vw] md:text-[1.25vw]"
          >
            {prevTeam.name}
          </span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={isAnimating}
          aria-label={`Go to ${nextTeam.name}`}
          className="group inline-flex cursor-pointer items-center gap-[1.99vw] bg-transparent transition-all duration-300 hover:translate-x-2 disabled:cursor-not-allowed disabled:opacity-40 sm:gap-[1.56vw] md:gap-[0.625vw]"
        >
          <span
            key={nextTeam.name}
            style={{ animation: "teamTextFade 0.4s ease-in-out" }}
            className="font-noto-sans text-secondary inline-block text-[3.98vw] font-bold sm:text-[3.13vw] md:text-[1.25vw]"
          >
            {nextTeam.name}
          </span>
          <div className="text-secondary h-[7.96vw] w-[7.96vw] -rotate-90 transition-transform duration-300 group-hover:scale-115 sm:h-[6.25vw] sm:w-[6.25vw] md:h-[2.5vw] md:w-[2.5vw]">
            <ArrowIcon className="h-full w-full" />
          </div>
        </button>
      </div>

      {/* Dedicated Tablet / Mobile Title Container with clean separation and clearance */}
      <div className="pointer-events-none relative z-10 mt-[2.6vw] mb-[2.08vw] flex w-full justify-center md:hidden">
        <div
          style={getTransformAndOpacity(animPhase, direction, "mobileTitle")}
        >
          <FlatTeamName name={currentTeam.name} />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Absolute Cog Positioning: */}
        <div className="absolute -bottom-[221.35vw] left-1/2 mb-[4.17vw] h-[319.01vw] w-[319.01vw] -translate-x-1/2 md:top-[calc(157%+1px)] md:right-0 md:mb-[1.67vw] md:h-[216.15vw] md:w-[216.15vw] md:translate-x-[-34%] md:-translate-y-1/2">
          <div className="relative h-full w-full rotate-[17deg] md:rotate-0">
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
