import { socialLinks } from "@/data/links";
import { profile } from "@/data/profile";

export function HeroSection() {
  const heroLinks = socialLinks.filter((link) =>
    ["Github", "LinkedIn", "E-Mail", "Discord"].includes(link.name),
  );

  return (
    <header id="top" className="hero-section">
      <span id="home" className="legacy-anchor" aria-hidden="true" />
      <div className="availability-line">
        <span aria-hidden="true" />
        <p>{profile.availability}</p>
      </div>

      <h1 className="hero-title" aria-label={profile.name}>
        <span data-cell="" data-cell-reveal="">
          Amitoj
        </span>
        <span data-cell="" data-cell-outline="" data-cell-reveal="">
          Singh
        </span>
      </h1>

      <div className="hero-details">
        <p className="hero-description">{profile.description}</p>

        <div className="hero-stats">
          {profile.stats.map((stat) => (
            <div key={stat.label}>
              <strong data-cell="">{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="hero-links" aria-label="Featured contact links">
          {heroLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target={link.url.startsWith("http") ? "_blank" : undefined}
              rel={link.url.startsWith("http") ? "noreferrer" : undefined}
            >
              {link.name === "E-Mail" ? "Email" : link.name} <span>↗</span>
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
