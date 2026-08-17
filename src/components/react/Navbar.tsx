import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react";

import Icon from "./Icon";

import logo from "../../assets/logo.svg?no-inline";
import { NAV_LINKS } from "../../lib/values";
import clsx from "clsx";

function DesktopNavItem({
  href,
  active = false,
  children,
}: ComponentPropsWithoutRef<"li"> & { href: string; active?: boolean }) {
  return (
    <li className="grow">
      <a
        href={href}
        className={`box-content ${active ? "shadow-[inset_0_-7px_0_0]" : "shadow-none"} shadow-secondary hover:text-secondary flex size-full items-center justify-center transition-colors`}
      >
        <span>{children}</span>
      </a>
    </li>
  );
}

function MobileNavItem({
  href,
  active = false,
  children,
}: ComponentPropsWithoutRef<"li"> & { href: string; active?: boolean }) {
  return (
    <li className="grow">
      <a
        href={href}
        className={`box-content ${active ? "shadow-[inset_7px_0_0_0]" : "shadow-none"} shadow-secondary flex size-full items-center justify-center py-1`}
      >
        <span>{children}</span>
      </a>
    </li>
  );
}

export default function Navbar({ currentPath }: { currentPath: string }) {
  const [isMobileNavShown, setIsMobileNavShown] = useState(false);

  const mobileNavRef = useRef<HTMLDivElement>(null);

  const hideMobileNav = () => {
    if (mobileNavRef.current) mobileNavRef.current.style.display = "none";
  };

  useEffect(() => {
    if (!mobileNavRef.current) return;

    const keyframes = isMobileNavShown
      ? [{ transform: "translate3d(0, 0, 0)" }]
      : [{ transform: "translate3d(0, -100%, 0)" }];

    const mobileNavAnim = mobileNavRef.current.animate(keyframes, {
      duration: 300,
      fill: "forwards",
      easing: "ease-out",
    });

    if (!isMobileNavShown) {
      mobileNavAnim.onfinish = hideMobileNav;
    }

    return () => {
      mobileNavAnim.onfinish = null;
      if (mobileNavRef.current) mobileNavRef.current.style.display = "";
      mobileNavAnim.commitStyles();
      mobileNavAnim.cancel();
    };
  }, [isMobileNavShown]);

  return (
    <>
      <header
        id="navbar"
        className="fixed top-0 right-0 left-0 z-50 min-h-15 text-white"
      >
        <div className="bg-primary relative z-10">
          <div className="p3d-container flex grow-0 items-center justify-between gap-12">
            <a href="/" className="">
              <img src={logo} className="h-15 w-auto py-2" />
            </a>

            {/* Desktop Nav */}
            <nav className="hidden grow self-stretch md:block">
              <ul className="flex size-full items-stretch justify-stretch text-2xl">
                {NAV_LINKS.map((v, i) => (
                  <DesktopNavItem
                    key={`${i} ${v.name}`}
                    href={v.href}
                    active={currentPath === v.href}
                  >
                    {v.name}
                  </DesktopNavItem>
                ))}
              </ul>
            </nav>

            <a
              href="https://discord.gg/CQnkc5gS6a"
              target="_blank"
              className="hover:text-secondary hidden grow-0 transition-colors md:block"
            >
              <Icon icon="discord" className="size-11" />
            </a>

            <button
              className="cursor-pointer md:hidden"
              onClick={() => setIsMobileNavShown(!isMobileNavShown)}
            >
              <Icon icon="menu" className="text-secondary size-10" />
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div
          ref={mobileNavRef}
          style={{ transform: "translate3d(0, -100%, 0)" }}
          className={clsx(
            "bg-primary absolute right-0 left-0 max-h-dvh py-4 md:hidden",
          )}
        >
          <nav>
            <ul className="flex size-full flex-col items-stretch justify-stretch text-2xl">
              {NAV_LINKS.map((v, i) => (
                <MobileNavItem
                  key={`${i} ${v.name}`}
                  href={v.href}
                  active={currentPath === v.href}
                >
                  {v.name}
                </MobileNavItem>
              ))}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
