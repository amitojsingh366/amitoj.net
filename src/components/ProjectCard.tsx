import type { Project } from "@/data/projects";

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const destination = project.github ?? project.link;
  const action = project.github ? "View source" : `Visit ${project.name}`;

  return (
    <article
      className="relative border-b border-[var(--line)] py-11"
      data-node=""
    >
      <span
        className="absolute top-[58px] -left-10 flex h-[17px] w-[17px] items-center justify-center border border-[var(--line)] bg-[var(--bg)] max-sm:-left-[26px]"
        data-dot=""
        aria-hidden="true"
      >
        <span className="block h-[5px] w-[5px] bg-[var(--line)]" data-dot-core="" />
      </span>
      <span
        className="absolute top-[66px] -left-[23px] h-px w-[23px] origin-left scale-x-0 bg-[var(--line)] max-sm:-left-[9px] max-sm:w-[9px]"
        data-stub=""
        aria-hidden="true"
      />

      <div
        className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-11 max-[900px]:grid-cols-1"
        data-reveal=""
      >
        <div>
          <div className="flex items-baseline gap-3.5 text-xs tracking-[0.16em] text-[var(--muted)] uppercase">
            <span className="text-[var(--accent)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{project.period ?? project.year}</span>
          </div>

          <h3
            className="mt-4 mb-0 text-5xl leading-[0.88] font-extrabold tracking-[-0.05em] uppercase sm:text-6xl md:text-7xl"
            data-cell=""
            data-cell-reveal=""
          >
            {project.displayLines.map((line, lineIndex) => (
              <span key={line}>
                {lineIndex > 0 && <br />}
                {line}
              </span>
            ))}
          </h3>

          <p className="mt-[18px] mb-0 grid text-xs leading-[1.8] text-[var(--muted)] lowercase">
            {project.subtitle.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>

          {destination && (
            <a
              className="mt-[26px] inline-block border border-[var(--accent)] px-[18px] py-[11px] text-xs tracking-[0.16em] text-[var(--accent)] uppercase transition-colors duration-150 hover:text-[#f2f2f6] hover:font-bold"
              href={destination}
              target="_blank"
              rel="noopener noreferrer"
            >
              {action}
            </a>
          )}
        </div>

        <div className="flex flex-col gap-[26px]">
          <ul className="grid list-none gap-4 p-0 text-sm leading-[1.6] font-light text-[#c9c9d2]">
            {project.bullets.map((bullet) => (
              <li
                className="border-l border-[var(--line)] pl-[18px]"
                key={bullet}
              >
                {bullet}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-1.5" aria-label="Technologies">
            {project.tech.map((technology) => (
              <span
                className="bg-[var(--panel-2)] px-[9px] py-1.5 text-xs tracking-[0.12em] text-[var(--muted)] uppercase"
                key={technology}
              >
                {technology}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
