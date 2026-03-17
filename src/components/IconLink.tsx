"use client";

import type { IconType } from "react-icons";

export type IconLinkProps = {
  Icon: IconType;
  link: string;
  className?: string;
  title?: string;
};

export function IconLink({
  Icon,
  link,
  className = "",
  title = "",
}: IconLinkProps) {
  return (
    <a
      href={link}
      className={`flex flex-col items-center justify-center ${className}`}
      title={title}
    >
      <Icon
        title={title}
        className="text-black dark:text-white text-xl hover:text-3xl transition-all duration-500 drop-shadow-[0_0_20px_rgba(0,0,0,0.5)] dark:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
      />
    </a>
  );
}
