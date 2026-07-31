import type { ComponentPropsWithoutRef } from "react";

import SocialIcon from "./SocialIcon";

import logo from "../../assets/logo.png";
import { NAV_LINKS } from "../../lib/values";

function NavItem({
  href,
  active = false,
  children,
}: ComponentPropsWithoutRef<"li"> & { href: string; active?: boolean }) {
  return (
    <li className="grow">
      <a
        href={href}
        className={`box-content ${active ? "shadow-[inset_0_-7px_0_0]" : "shadow-none"} shadow-secondary flex size-full items-center justify-center`}
      >
        <span>{children}</span>
      </a>
    </li>
  );
}

export default function Navbar({ currentPath }: { currentPath: string }) {
  return (
    <>
      <header id="navbar" className="bg-primary">
        <div className="container mx-auto px-8 flex grow-0 items-center justify-between gap-12 text-white">
          <img src={logo.src} className="h-15 w-auto py-2" />

          <nav className="grow self-stretch">
            <ul className="size-full flex items-stretch justify-stretch text-2xl">
              {NAV_LINKS.map((v, i) => (
                <NavItem
                  key={`${i} ${v.name}`}
                  href={v.href}
                  active={currentPath === v.href}
                >
                  {v.name}
                </NavItem>
              ))}
            </ul>
          </nav>

          <SocialIcon icon="discord" className="size-11 grow-0" />
        </div>
      </header>
    </>
  );
}
