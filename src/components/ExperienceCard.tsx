import type { Experience } from "@/data/experience";

export function ExperienceCard({ experience }: { experience: Experience }) {
  const links = [
    experience.link && { label: "Site", url: experience.link },
    experience.github && { label: "Repo", url: experience.github },
    experience.instagram && { label: "Instagram", url: experience.instagram },
  ].filter(Boolean) as { label: string; url: string }[];

  return (
    <article className="experience-entry" data-reveal="">
      <div className="experience-entry__meta">
        <div className="entry-index">
          <span>{experience.period}</span>
        </div>
        <h3 className="experience-entry__company">{experience.company}</h3>
        <p>{experience.location}</p>
        {links.length > 0 && (
          <div className="experience-entry__links">
            {links.map((link) => (
              <a
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

      <div className="experience-entry__details">
        <h3>{experience.role}</h3>
        <ul>
          {experience.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
