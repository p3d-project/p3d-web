import type { ImageMetadata } from "astro";

/** Character silhouette assets (Green for top team cards, Blue for bottom carousel). */
import aigisGreen from "../assets/aigis 2.svg?url";
import akihikoGreen from "../assets/akihikosanada 2.svg?url";
import fuukaGreen from "../assets/fuukayamagishi 2.svg?url";
import junpeiGreen from "../assets/junpeiiori 2.svg?url";
import kenGreen from "../assets/kenamada 2.svg?url";
import koromaruGreen from "../assets/koromaru 2.svg?url";
import kotoneGreen from "../assets/kotoneshiomi 3.svg?url";
import makotoGreen from "../assets/makotoyuki 3.svg?url";
import mitsuruGreen from "../assets/mitsurukirijo 2.svg?url";
import shinjiroGreen from "../assets/shinjiroaragaki 2.svg?url";
import yukariGreen from "../assets/yukaritakeba 2.svg?url";

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
    description: `<p>Responsible for designing, architecting and programming various game &amp; game-related codebases.</p><p><em>persona-3-dual</em> is the actual game itself, developed in C++. The game itself is built with our in-house <em>aegis-engine</em>. At the moment, we use <em>BlocksDS</em> as our SDK. To interact with DS hardware, we use the <em>libnds</em> library.</p><p><em>aegis-engine</em> is a lightweight, strictly-bounded C++17 Entity-Component (EC) and Data-Oriented Design (DOD) hybrid game framework.</p><p><em>p3d-amicitia</em> (a fork of <em>Amicitia</em>) is an editor for file formats used in Atlus' Persona games, modified by member(s) of the P3D team in hopes of an easier workflow</p>`,
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
    description: `<p>Responsible for implementing and maintaining the various websites that the project hosts.</p><p><em>p3d-web</em> is designed to act as the primary gateway for the project, serving as the main distribution point for project updates. It is built on the <em>Astro</em> framework with <em>React</em> components and <em>Tailwind CSS</em> to leverage fast static-site generation and responsive, utility-driven design.</p><p><em>p3d-docs</em> is the official documentation website. It serves as the main distribution point for all project docs, including team setup &amp; codebase references. Engineered for high performance and long-term maintainability, it is built on the <em>Astro</em> framework with <em>React</em> components and <em>Tailwind CSS</em> to leverage fast static-site generation and responsive, utility-driven design.</p><p><em>elizabeth-bot</em> is a bespoke Discord onboarding and application management bot built for the P3D Project that streamlines the applicant workflow.</p>`,
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
    description: `<p>Responsible for designing and producing the game's interface assets, including menus, HUD elements, icons, dialogue boxes, and overall interface layout and flow, while keeping everything visually consistent, usable, and within the technical limits of the Nintendo DS.</p><p>In practice, that covers things like:</p><ul><li>Main menu, pause menu, other menus and settings screens</li><li>HUD elements (health, status effects, maybe text fonts, etc.)</li><li>Dialogue text boxes</li><li>Battle &amp; icons</li><li>Other on-screen interface element that needs a consistent, readable style</li><li>Website design</li></ul>`,
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
    description: `<p>A combo of modders/rippers of Persona games + 3D modellers, responsible for creating the 3D assets (environments, character models, etc.) used in the game.</p><p><em>p3d-amicitia</em> (a fork of <em>Amicitia</em>) is an editor for file formats used in Atlus' Persona games, modified by member(s) of the P3D team in hopes of an easier workflow</p>`,
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
    description: `<p>Responsible for the graphics of the project. That doesn't mean it's only going to be making sprites for the game. It also means, for example, doing assets for the website, for a video, for a milestone etc.</p><p>Some examples of what we do can be, but are not limited to:</p><ol><li>Creating sprites for the game: Creating sprites can vary a lot, from making portraits for characters, making backgrounds, making textures, etc...</li><li>Making website assets</li><li>Making 3D model texture assets</li></ol>`,
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
    description: `<p>Responsible for creating, modifying, and optimizing music and SFX for the project, based on the ones found in Persona 3 FES, to both leave our mark on the history of Persona 3, and to avoid copyright issues with the original developers (that being Atlus co. and SEGA).</p>`,
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
    description: `<p>The video team is responsible for creating various videos needed for the project (promo videos, tutorials, etc.) and is also responsible for video conversion/compression (for in-game videos)</p>`,
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
