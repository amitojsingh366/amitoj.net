import { HeroSection } from "@/components/HeroSection";
import { ProjectCard } from "@/components/ProjectCard";
import { ExperienceCard } from "@/components/ExperienceCard";
import { CompactList } from "@/components/CompactList";
import { ContactSection } from "@/components/ContactSection";
import { PixelGridCanvas } from "@/components/PixelGridCanvas";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteNav } from "@/components/SiteNav";
import { moreProjects, projects } from "@/data/projects";
import { experiences, otherExperiences } from "@/data/experience";
import { profile } from "@/data/profile";

export default function Home() {
  return (
    <main className="relative overflow-x-clip">
      <PixelGridCanvas />
      <SiteNav />

      <div className="relative z-[1]" data-smooth="">
        <HeroSection />

        <section
          id="experience"
          className="mx-auto w-full max-w-[1440px] scroll-mt-12 px-7 pt-12 pb-8 max-sm:px-5 max-sm:pt-[68px]"
        >
          <SectionHeading
            number="01"
            meta={profile.historyRange}
            headingClassName="text-5xl sm:text-7xl md:text-8xl lg:text-9xl"
          >
            Experience
          </SectionHeading>

          <div>
            {experiences.map((experience) => (
              <ExperienceCard
                key={`${experience.company}-${experience.role}`}
                experience={experience}
              />
            ))}
          </div>

          <CompactList
            label="Other roles"
            items={otherExperiences.map((experience) => ({
              period: experience.period,
              title: experience.role,
              detail: experience.company,
              href: experience.link ?? experience.github ?? experience.instagram,
            }))}
          />
        </section>

        <section
          id="projects"
          className="mx-auto w-full max-w-[1440px] scroll-mt-12 px-7 pt-[88px] pb-8 max-sm:px-5 max-sm:pt-[68px]"
        >
          <SectionHeading number="02">Projects</SectionHeading>

          <div
            className="relative mt-2 grid grid-cols-[40px_minmax(0,1fr)] max-sm:grid-cols-[26px_minmax(0,1fr)]"
            data-wire-track=""
          >
            <div className="relative" aria-hidden="true">
              <span
                className="absolute top-0 bottom-0 left-2 w-px bg-[var(--line)] max-sm:left-1"
                data-wire-line=""
              />
              <span
                className="absolute top-0 left-2 h-0 w-px bg-[var(--accent)] shadow-[0_0_14px_var(--accent)] max-sm:left-1"
                data-wire-fill=""
              />
            </div>
            <div>
              {projects.map((project, i) => (
                <ProjectCard key={project.name} project={project} index={i} />
              ))}
            </div>
          </div>

          <CompactList
            label="More projects"
            items={moreProjects.map((project) => ({
              period: project.period ?? String(project.year),
              title: project.name,
              detail: project.subtitle.join(" · "),
              tags: project.tech,
              href: project.github ?? project.link,
            }))}
          />
        </section>

        <ContactSection />
      </div>
      <div data-spacer="" aria-hidden="true" />
    </main>
  );
}
