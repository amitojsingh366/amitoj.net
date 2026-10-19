import { Fragment } from "react";
import type { Project } from "@/data/projects";

// Wraps only between items, so multi-word items stay whole and each "·"
// separator ends a line instead of starting the next one.
function SeparatedList({ items }: { items: string[] }) {
  return items.map((item, index) => (
    <Fragment key={item}>
      {index > 0 && " "}
      <span className="whitespace-nowrap">
        {item}
        {index < items.length - 1 && " ·"}
      </span>
    </Fragment>
  ));
}

export function ProjectCard({ project }: { project: Project }) {
  const links = [
    project.link && { label: "Visit site", url: project.link },
    project.github && { label: "View source", url: project.github },
  ].filter(Boolean) as { label: string; url: string }[];
  const [summary, detail] = project.subtitle;

  return (
    <article
      className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-10 border-b border-[var(--line)] py-[34px] last:border-b-0 max-sm:grid-cols-1 max-sm:gap-7"
      data-reveal=""
    >
      <div>
        <div className="flex items-baseline gap-3.5 text-xs tracking-[0.16em] text-[var(--muted)] uppercase">
          <span className="text-[var(--accent)]">
            {project.period ?? project.year}
          </span>
        </div>
        <p className="mt-3 mb-0 text-sm leading-[1.4] font-semibold tracking-[0.08em] text-[var(--fg)] uppercase">
          {summary}
        </p>
        {detail && (
          <p className="mt-[9px] mb-0 text-xs leading-[1.7] font-light text-[var(--muted)]">
            <SeparatedList items={detail.split(" · ")} />
          </p>
        )}
        {links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {links.map((link) => (
              <a
                className="inline-flex items-center justify-between gap-4 border border-[var(--line)] px-4 py-[11px] text-xs tracking-[0.16em] text-[var(--muted)] uppercase transition-colors duration-150 hover:border-[var(--accent)] hover:text-[#f2f2f6] hover:font-bold"
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{link.label}</span>
                <span>↗</span>
              </a>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="mt-0 mb-4 text-2xl leading-[1.1] font-extrabold tracking-[-0.03em] uppercase">
          {project.name}
        </h3>
        <ul className="grid list-none gap-3 p-0 text-sm leading-[1.65] font-light text-[#c9c9d2]">
          {project.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <p className="mt-5 mb-0 text-xs leading-[1.7] tracking-[0.12em] text-[var(--muted)] uppercase">
          <SeparatedList items={project.tech} />
        </p>
      </div>
    </article>
  );
}
