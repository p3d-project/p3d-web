import type { ImageMetadata } from "astro";

/** Character silhouette assets (Green for top team cards, Blue for bottom carousel). */
import aigisGreen from "../assets/silhouette_aigis_green.svg?url";
import akihikoGreen from "../assets/silhouette_akihiko_green.svg?url";
import fuukaGreen from "../assets/silhouette_fuuka_green.svg?url";
import junpeiGreen from "../assets/silhouette_junpei_green.svg?url";
import kenGreen from "../assets/silhouette_ken_green.svg?url";
import koromaruGreen from "../assets/silhouette_koromaru_green.svg?url";
import kotoneGreen from "../assets/silhouette_kotone_green.svg?url";
import makotoGreen from "../assets/silhouette_makoto_green.svg?url";
import mitsuruGreen from "../assets/silhouette_mitsuru_green.svg?url";
import shinjiroGreen from "../assets/silhouette_shinjiro_green.svg?url";
import yukariGreen from "../assets/silhouette_yukari_green.svg?url";

import makotoBlue from "../assets/silhouette_makoto_blue.png";
import kotoneBlue from "../assets/silhouette_kotone_blue.png";
import aigisBlue from "../assets/silhouette_aigis_blue.png";
import yukariBlue from "../assets/silhouette_yukari_blue.png";
import kenBlue from "../assets/silhouette_ken_blue.png";
import koromaruBlue from "../assets/silhouette_koromaru_blue.png";
import akihikoBlue from "../assets/silhouette_akihiko_blue.png";
import mitsuruBlue from "../assets/silhouette_mitsuru_blue.png";
import shinjiroBlue from "../assets/silhouette_shinjiro_blue.png";
import junpeiBlue from "../assets/silhouette_junpei_blue.png";
import fuukaBlue from "../assets/silhouette_fuuka_blue.png";

export interface Silhouette {
  src: ImageMetadata | string;
  alt: string;
  /** Pixel height at mobile breakpoints (< lg). */
  heightMobile: number;
  /** Pixel height at desktop breakpoints (>= lg). */
  heightDesktop: number;
}

export interface TeamData {
  id: string;
  name: string;
  description: string;
  /** Green silhouettes for the top team grid. */
  silhouettes: Silhouette[];
  /** Blue silhouettes for the bottom carousel view. */
  silhouettesBlue: Silhouette[];
}

/** Event name shared by TeamGrid (publisher) and TeamCarousel (subscriber). */
export const TEAM_SELECTED_EVENT = "teamSelected";

export const TEAMS: TeamData[] = [
  {
    id: "game-dev",
    name: "Game Dev",
    description: `<p>Responsible for designing, architecting and programming various game &amp; game-related codebases.</p>`,
    silhouettes: [
      {
        src: makotoGreen,
        alt: "Makoto Yuki",
        heightMobile: 215,
        heightDesktop: 255,
      },
      {
        src: kotoneGreen,
        alt: "Kotone Shiomi",
        heightMobile: 215,
        heightDesktop: 255,
      },
    ],
    silhouettesBlue: [
      {
        src: makotoBlue,
        alt: "Makoto Yuki",
        heightMobile: 215,
        heightDesktop: 255,
      },
      {
        src: kotoneBlue,
        alt: "Kotone Shiomi",
        heightMobile: 215,
        heightDesktop: 255,
      },
    ],
  },
  {
    id: "web-dev",
    name: "Web Dev",
    description: `<p>Responsible for implementing and maintaining the various websites &amp; web-based tools that the project hosts.</p>`,
    silhouettes: [
      { src: aigisGreen, alt: "Aigis", heightMobile: 215, heightDesktop: 255 },
    ],
    silhouettesBlue: [
      { src: aigisBlue, alt: "Aigis", heightMobile: 215, heightDesktop: 255 },
    ],
  },
  {
    id: "ux-ui",
    name: "UX/UI",
    description: `<p>Responsible for creating the project’s visual designs including art standards, in-game interfaces (menus, etc.), website design, and overall layout and user flow.</p>`,
    silhouettes: [
      {
        src: yukariGreen,
        alt: "Yukari Takeba",
        heightMobile: 215,
        heightDesktop: 255,
      },
    ],
    silhouettesBlue: [
      {
        src: yukariBlue,
        alt: "Yukari Takeba",
        heightMobile: 215,
        heightDesktop: 255,
      },
    ],
  },
  {
    id: "3d",
    name: "3D",
    description: `<p>Responsible for creating the 3D assets &amp; animations (environments, character models, etc.) used in the game.</p>`,
    silhouettes: [
      {
        src: kenGreen,
        alt: "Ken Amada",
        heightMobile: 215,
        heightDesktop: 255,
      },
      {
        src: koromaruGreen,
        alt: "Koromaru",
        heightMobile: 108,
        heightDesktop: 128,
      },
    ],
    silhouettesBlue: [
      { src: kenBlue, alt: "Ken Amada", heightMobile: 215, heightDesktop: 255 },
      {
        src: koromaruBlue,
        alt: "Koromaru",
        heightMobile: 108,
        heightDesktop: 128,
      },
    ],
  },
  {
    id: "graphics",
    name: "Graphics",
    description: `<p>Responsible for the graphics of the project, including pixel art, texturing, graphic design, &amp; website assets.</p>`,
    silhouettes: [
      {
        src: akihikoGreen,
        alt: "Akihiko Sanada",
        heightMobile: 230,
        heightDesktop: 255,
      },
      {
        src: mitsuruGreen,
        alt: "Mitsuru Kirijo",
        heightMobile: 230,
        heightDesktop: 255,
      },
      {
        src: shinjiroGreen,
        alt: "Shinjiro Aragaki",
        heightMobile: 250,
        heightDesktop: 275,
      },
    ],
    silhouettesBlue: [
      {
        src: akihikoBlue,
        alt: "Akihiko Sanada",
        heightMobile: 230,
        heightDesktop: 255,
      },
      {
        src: mitsuruBlue,
        alt: "Mitsuru Kirijo",
        heightMobile: 230,
        heightDesktop: 255,
      },
      {
        src: shinjiroBlue,
        alt: "Shinjiro Aragaki",
        heightMobile: 250,
        heightDesktop: 275,
      },
    ],
  },
  {
    id: "music",
    name: "Music",
    description: `<p>Responsible for producing original songs and sound effects for the project, inspired by existing Persona 3 audio design.</p>`,
    silhouettes: [
      {
        src: junpeiGreen,
        alt: "Junpei Iori",
        heightMobile: 215,
        heightDesktop: 255,
      },
    ],
    silhouettesBlue: [
      {
        src: junpeiBlue,
        alt: "Junpei Iori",
        heightMobile: 215,
        heightDesktop: 255,
      },
    ],
  },
  {
    id: "video",
    name: "Video",
    description: `<p>Responsible for producing &amp; mastering videos used across the project (promo videos, tutorials, in-game video optimization, etc.)</p>`,
    silhouettes: [
      {
        src: fuukaGreen,
        alt: "Fuuka Yamagishi",
        heightMobile: 200,
        heightDesktop: 235,
      },
    ],
    silhouettesBlue: [
      {
        src: fuukaBlue,
        alt: "Fuuka Yamagishi",
        heightMobile: 200,
        heightDesktop: 235,
      },
    ],
  },
];

/** O(1) lookup by team id — used by TeamGrid layout helpers. */
export const TEAMS_BY_ID: Readonly<Record<string, TeamData>> =
  Object.fromEntries(TEAMS.map((team) => [team.id, team]));
