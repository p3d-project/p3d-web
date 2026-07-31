import type { ComponentPropsWithoutRef } from "react";

import socialIcons from "../../assets/social-icons.svg?url";

const socialIconMap = {
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

export default function SocialIcon({ icon, ...props }: SocialIconProps) {
  return (
    <svg {...props}>
      {/* <title>{socialIconMap[icon]} icon</title> */}
      <use href={`${socialIcons}#${icon}`} />
    </svg>
  );
}
