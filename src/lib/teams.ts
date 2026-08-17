/** Character silhouette assets for team cards and the carousel. */
import aigis from "../assets/aigis 2.svg?url";
import akihiko from "../assets/akihikosanada 2.svg?url";
import fuuka from "../assets/fuukayamagishi 2.svg?url";
import junpei from "../assets/junpeiiori 2.svg?url";
import ken from "../assets/kenamada 2.svg?url";
import koromaru from "../assets/koromaru 2.svg?url";
import kotone from "../assets/kotoneshiomi 3.svg?url";
import makoto from "../assets/makotoyuki 3.svg?url";
import mitsuru from "../assets/mitsurukirijo 2.svg?url";
import shinjiro from "../assets/shinjiroaragaki 2.svg?url";
import yukari from "../assets/yukaritakeba 2.svg?url";

export interface Silhouette {
  src: string;
  alt: string;
  /** Pixel height at mobile breakpoints (< lg). */
  heightMobile: number;
  /** Pixel height at desktop breakpoints (>= lg). */
  heightDesktop: number;
}

export interface TeamData {
  id: string;
  name: string;
  silhouettes: Silhouette[];
  /**
   * Clockwise rotation (degrees) for the future cog wheel.
   * Provisional values — evenly spaced at 360 / 7. Re-tune once the cog
   * asset exists; final angles depend on its dimensions and label placement.
   */
  angle: number;
}

/** Event name shared by TeamGrid (publisher) and TeamCarousel (subscriber). */
export const TEAM_SELECTED_EVENT = "teamSelected";

/** Team list. Angle values are provisional — revisit when the cog wheel is built. */
export const TEAMS: TeamData[] = [
  {
    id: "game-dev",
    name: "Game Dev",
    silhouettes: [
      { src: makoto, alt: "Makoto Yuki", heightMobile: 215, heightDesktop: 255 },
      { src: kotone, alt: "Kotone Shiomi", heightMobile: 215, heightDesktop: 255 },
    ],
    angle: 0,
  },
  {
    id: "web-dev",
    name: "Web Dev",
    silhouettes: [
      { src: aigis, alt: "Aigis", heightMobile: 215, heightDesktop: 255 },
    ],
    angle: 51.4,
  },
  {
    id: "ux-ui",
    name: "UX/UI",
    silhouettes: [
      { src: yukari, alt: "Yukari Takeba", heightMobile: 215, heightDesktop: 255 },
    ],
    angle: 102.9,
  },
  {
    id: "3d",
    name: "3D",
    silhouettes: [
      { src: ken, alt: "Ken Amada", heightMobile: 215, heightDesktop: 255 },
      { src: koromaru, alt: "Koromaru", heightMobile: 108, heightDesktop: 128 },
    ],
    angle: 154.3,
  },
  {
    id: "graphics",
    name: "Graphics",
    silhouettes: [
      { src: akihiko, alt: "Akihiko Sanada", heightMobile: 230, heightDesktop: 255 },
      { src: mitsuru, alt: "Mitsuru Kirijo", heightMobile: 230, heightDesktop: 255 },
      { src: shinjiro, alt: "Shinjiro Aragaki", heightMobile: 250, heightDesktop: 275 },
    ],
    angle: 205.7,
  },
  {
    id: "music",
    name: "Music",
    silhouettes: [
      { src: junpei, alt: "Junpei Iori", heightMobile: 215, heightDesktop: 255 },
    ],
    angle: 257.1,
  },
  {
    id: "video",
    name: "Video",
    silhouettes: [
      { src: fuuka, alt: "Fuuka Yamagishi", heightMobile: 200, heightDesktop: 235 },
    ],
    angle: 308.6,
  },
];

/** O(1) lookup by team id — used by TeamGrid layout helpers. */
export const TEAMS_BY_ID: Readonly<Record<string, TeamData>> = Object.fromEntries(
  TEAMS.map((team) => [team.id, team]),
);
