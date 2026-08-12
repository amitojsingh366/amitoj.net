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
    <article className="project-entry" data-node="">
      <span className="project-entry__dot" data-dot="" aria-hidden="true">
        <span data-dot-core="" />
      </span>
      <span className="project-entry__stub" data-stub="" aria-hidden="true" />

      <div className="project-entry__layout" data-reveal="">
        <div className="project-entry__identity">
          <div className="entry-index">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <span>{project.period ?? project.year}</span>
          </div>

          <h3 data-cell="" data-cell-reveal="">
            {project.displayLines.map((line, lineIndex) => (
              <span key={line}>
                {lineIndex > 0 && <br />}
                {line}
              </span>
            ))}
          </h3>

          <p className="project-entry__subtitle">
            {project.subtitle.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>

          {destination && (
            <a
              className="outline-link"
              href={destination}
              target="_blank"
              rel="noopener noreferrer"
            >
              {action}
            </a>
          )}
        </div>

        <div className="project-entry__content">
          <ul className="project-points">
            {project.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>

          <div className="tech-list" aria-label="Technologies">
            {project.tech.map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
