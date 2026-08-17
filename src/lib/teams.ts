// Silhouette SVG imports
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
  /** Tailwind arbitrary height, mobile breakpoint (< lg) */
  heightMobile: number;
  /** Tailwind arbitrary height, desktop breakpoint (>= lg) */
  heightDesktop: number;
}

export interface TeamData {
  id: string;
  name: string;
  silhouettes: Silhouette[];
}

export const TEAMS: TeamData[] = [
  {
    id: "game-dev",
    name: "Game Dev",
    silhouettes: [
      { src: makoto, alt: "Makoto Yuki", heightMobile: 195, heightDesktop: 230 },
      { src: kotone, alt: "Kotone Shiomi", heightMobile: 195, heightDesktop: 230 },
    ],
  },
  {
    id: "web-dev",
    name: "Web Dev",
    silhouettes: [
      { src: aigis, alt: "Aigis", heightMobile: 195, heightDesktop: 230 },
    ],
  },
  {
    id: "ux-ui",
    name: "UX/UI",
    silhouettes: [
      { src: yukari, alt: "Yukari Takeba", heightMobile: 195, heightDesktop: 230 },
    ],
  },
  {
    id: "3d",
    name: "3D",
    silhouettes: [
      { src: ken, alt: "Ken Amada", heightMobile: 195, heightDesktop: 230 },
      { src: koromaru, alt: "Koromaru", heightMobile: 98, heightDesktop: 115 },
    ],
  },
  {
    id: "graphics",
    name: "Graphics",
    silhouettes: [
      { src: akihiko, alt: "Akihiko Sanada", heightMobile: 210, heightDesktop: 230 },
      { src: mitsuru, alt: "Mitsuru Kirijo", heightMobile: 210, heightDesktop: 230 },
      { src: shinjiro, alt: "Shinjiro Aragaki", heightMobile: 230, heightDesktop: 245 },
    ],
  },
  {
    id: "music",
    name: "Music",
    silhouettes: [
      { src: junpei, alt: "Junpei Iori", heightMobile: 195, heightDesktop: 230 },
    ],
  },
  {
    id: "video",
    name: "Video",
    silhouettes: [
      { src: fuuka, alt: "Fuuka Yamagishi", heightMobile: 180, heightDesktop: 210 },
    ],
  },
];
