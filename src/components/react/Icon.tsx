import type { ComponentPropsWithoutRef } from "react";

import icons from "../../assets/icons.svg?url";

const socialIconMap = {
  // Common
  menu: "Menu",
  // Social Media
  youtube: "YouTube",
  reddit: "Reddit",
  xelon: "X",
  bluesky: "Bluesky",
  instagram: "Instagram",
  discord: "Discord",
};

type SocialIconProps = ComponentPropsWithoutRef<"svg"> & {
  icon: keyof typeof socialIconMap;
};

export default function Icon({ icon, ...props }: SocialIconProps) {
  return (
    <svg {...props}>
      {/* <title>{socialIconMap[icon]} icon</title> */}
      <use href={`${icons}#${icon}`} />
    </svg>
  );
}
