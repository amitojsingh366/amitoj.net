import type { ReactNode } from "react";

export function SectionHeading({
  number,
  meta,
  children,
  headingClassName = "text-6xl sm:text-7xl md:text-8xl lg:text-9xl",
}: {
  number: string;
  meta?: string;
  children: ReactNode;
  headingClassName?: string;
}) {
  return (
    <div className="flex flex-wrap items-end gap-5 border-b border-[var(--line)] pb-[18px] max-sm:gap-3">
      <span className="text-xs tracking-[0.18em] text-[var(--accent)]">
        {number}
      </span>
      <h2
        className={`${headingClassName} m-0 leading-[0.84] font-extrabold tracking-[-0.05em] uppercase`}
        data-cell=""
        data-cell-reveal=""
      >
        {children}
      </h2>
      {meta && (
        <span className="ml-auto pb-1 text-xs tracking-[0.16em] text-[var(--muted)] uppercase max-sm:hidden">
          {meta}
        </span>
      )}
    </div>
  );
}
