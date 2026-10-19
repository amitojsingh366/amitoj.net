export interface CompactItem {
  period: string;
  title: string;
  detail: string;
  tags?: string[];
  href?: string;
}

// Keeps each "·" separator at the end of a wrapped line instead of the start.
const glueSeparators = (text: string) => text.replaceAll(" · ", " · ");

export function CompactList({
  label,
  items,
}: {
  label: string;
  items: CompactItem[];
}) {
  const titleClassName =
    "text-sm font-semibold tracking-[0.08em] text-[var(--fg)] uppercase";

  return (
    <div className="mt-16 max-sm:mt-12">
      <h3 className="mt-0 mb-5 text-xs tracking-[0.2em] text-[var(--accent)] uppercase">
        {label}
      </h3>
      <ul className="m-0 list-none border-t border-[var(--line)] p-0">
        {items.map((item) => (
          <li
            className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] items-baseline gap-10 border-b border-[var(--line)] py-[18px] max-md:grid-cols-1 max-md:gap-2"
            key={item.title}
            data-reveal=""
          >
            <div className="grid grid-cols-[12rem_minmax(0,1fr)] items-baseline gap-6 max-lg:grid-cols-1 max-lg:gap-2">
              <span className="text-xs tracking-[0.16em] text-[var(--accent)] uppercase">
                {item.period}
              </span>
              {item.href ? (
                <a
                  className={`${titleClassName} justify-self-start transition-colors duration-150 hover:font-bold hover:text-[#f2f2f6]`}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.title} <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <span className={titleClassName}>{item.title}</span>
              )}
            </div>
            <div className="grid gap-1.5">
              <p className="m-0 text-sm leading-[1.6] font-light text-[#c9c9d2]">
                {glueSeparators(item.detail)}
              </p>
              {item.tags && (
                <p className="m-0 text-xs leading-[1.7] tracking-[0.12em] text-[var(--muted)] uppercase">
                  {glueSeparators(item.tags.join(" · "))}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
