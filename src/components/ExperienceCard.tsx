import type { Experience } from "@/data/experience";

export function ExperienceCard({ experience }: { experience: Experience }) {
  const links = [
    experience.link && { label: "Site", url: experience.link },
    experience.github && { label: "Repo", url: experience.github },
    experience.instagram && { label: "Instagram", url: experience.instagram },
  ].filter(Boolean) as { label: string; url: string }[];

  return (
    <article
      className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-10 border-b border-[var(--line)] py-[34px] last:border-b-0 max-sm:grid-cols-1 max-sm:gap-7"
      data-reveal=""
    >
      <div>
        <div className="flex items-baseline gap-3.5 text-xs tracking-[0.16em] text-[var(--muted)] uppercase">
          <span className="text-[var(--accent)]">{experience.period}</span>
        </div>
        <h3 className="mt-3 mb-0 text-sm leading-[1.4] font-semibold tracking-[0.08em] text-[var(--fg)] uppercase">
          {experience.company}
        </h3>
        <p className="mt-[9px] mb-0 text-xs leading-[1.7] font-light text-[var(--muted)]">
          {experience.location}
        </p>
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
          {experience.role}
        </h3>
        <ul className="grid list-none gap-3 p-0 text-sm leading-[1.65] font-light text-[#c9c9d2]">
          {experience.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
