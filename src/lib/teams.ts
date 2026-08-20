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

// Temporary placeholder text used across all teams
const PLACEHOLDER_DESC = "Want to see how Tatsumi Port Island is coming to life? Catch our latest behind-the-scenes progress, tutorials, and music drops across all our channels. Join the conversation on Discord, watch our major dev updates on YouTube, and tag us on Twitter/X or Instagram when you share the game. Every single share helps this passion project grow!";

export const TEAMS: TeamData[] = [
  {
    id: "game-dev",
    name: "Game Dev",
    description: `[GAME DEV] ${PLACEHOLDER_DESC}`,
    silhouettes: [
      { src: makotoGreen, alt: "Makoto Yuki", heightMobile: 215, heightDesktop: 255 },
      { src: kotoneGreen, alt: "Kotone Shiomi", heightMobile: 215, heightDesktop: 255 },
    ],
    silhouettesBlue: [
      { src: makotoBlue, alt: "Makoto Yuki", heightMobile: 215, heightDesktop: 255 },
      { src: kotoneBlue, alt: "Kotone Shiomi", heightMobile: 215, heightDesktop: 255 },
    ],
  },
  {
    id: "web-dev",
    name: "Web Dev",
    description: `[WEB DEV] ${PLACEHOLDER_DESC}`,
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
    description: `[UX/UI] ${PLACEHOLDER_DESC}`,
    silhouettes: [
      { src: yukariGreen, alt: "Yukari Takeba", heightMobile: 215, heightDesktop: 255 },
    ],
    silhouettesBlue: [
      { src: yukariBlue, alt: "Yukari Takeba", heightMobile: 215, heightDesktop: 255 },
    ],
  },
  {
    id: "3d",
    name: "3D",
    description: `[3D] ${PLACEHOLDER_DESC}`,
    silhouettes: [
      { src: kenGreen, alt: "Ken Amada", heightMobile: 215, heightDesktop: 255 },
      { src: koromaruGreen, alt: "Koromaru", heightMobile: 108, heightDesktop: 128 },
    ],
    silhouettesBlue: [
      { src: kenBlue, alt: "Ken Amada", heightMobile: 215, heightDesktop: 255 },
      { src: koromaruBlue, alt: "Koromaru", heightMobile: 108, heightDesktop: 128 },
    ],
  },
  {
    id: "graphics",
    name: "Graphics",
    description: `[GRAPHICS] ${PLACEHOLDER_DESC}`,
    silhouettes: [
      { src: akihikoGreen, alt: "Akihiko Sanada", heightMobile: 230, heightDesktop: 255 },
      { src: mitsuruGreen, alt: "Mitsuru Kirijo", heightMobile: 230, heightDesktop: 255 },
      { src: shinjiroGreen, alt: "Shinjiro Aragaki", heightMobile: 250, heightDesktop: 275 },
    ],
    silhouettesBlue: [
      { src: akihikoBlue, alt: "Akihiko Sanada", heightMobile: 230, heightDesktop: 255 },
      { src: mitsuruBlue, alt: "Mitsuru Kirijo", heightMobile: 230, heightDesktop: 255 },
      { src: shinjiroBlue, alt: "Shinjiro Aragaki", heightMobile: 250, heightDesktop: 275 },
    ],
  },
  {
    id: "music",
    name: "Music",
    description: `[MUSIC] ${PLACEHOLDER_DESC}`,
    silhouettes: [
      { src: junpeiGreen, alt: "Junpei Iori", heightMobile: 215, heightDesktop: 255 },
    ],
    silhouettesBlue: [
      { src: junpeiBlue, alt: "Junpei Iori", heightMobile: 215, heightDesktop: 255 },
    ],
  },
  {
    id: "video",
    name: "Video",
    description: `[VIDEO] ${PLACEHOLDER_DESC}`,
    silhouettes: [
      { src: fuukaGreen, alt: "Fuuka Yamagishi", heightMobile: 200, heightDesktop: 235 },
    ],
    silhouettesBlue: [
      { src: fuukaBlue, alt: "Fuuka Yamagishi", heightMobile: 200, heightDesktop: 235 },
    ],
  },
];

/** O(1) lookup by team id — used by TeamGrid layout helpers. */
export const TEAMS_BY_ID: Readonly<Record<string, TeamData>> = Object.fromEntries(
  TEAMS.map((team) => [team.id, team]),
);