import type { ReactNode } from "react";

export function SectionHeading({
  number,
  meta,
  children,
}: {
  number: string;
  meta?: string;
  children: ReactNode;
}) {
  return (
    <div className="section-heading">
      <span className="section-heading__number">{number}</span>
      <h2 data-cell="" data-cell-reveal="">
        {children}
      </h2>
      {meta && <span className="section-heading__meta">{meta}</span>}
    </div>
  );
}
