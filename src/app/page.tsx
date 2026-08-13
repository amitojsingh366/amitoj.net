import { HeroSection } from "@/components/HeroSection";
import { ProjectCard } from "@/components/ProjectCard";
import { ExperienceCard } from "@/components/ExperienceCard";
import { ContactSection } from "@/components/ContactSection";
import { PixelGridCanvas } from "@/components/PixelGridCanvas";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteNav } from "@/components/SiteNav";
import { projects } from "@/data/projects";
import { experiences } from "@/data/experience";
import { profile } from "@/data/profile";

export default function Home() {
  return (
    <main className="relative overflow-x-clip">
      <PixelGridCanvas />
      <SiteNav />

      <div className="relative z-[1]" data-smooth="">
        <HeroSection />

        <section
          id="projects"
          className="mx-auto w-full max-w-[1440px] scroll-mt-12 px-7 pt-12 pb-8 max-sm:px-5 max-sm:pt-[68px]"
        >
          <SectionHeading number="01">Work</SectionHeading>

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
        </section>

        <section
          id="experience"
          className="mx-auto w-full max-w-[1440px] scroll-mt-12 px-7 pt-[88px] pb-8 max-sm:px-5 max-sm:pt-[68px]"
        >
          <SectionHeading number="02" meta={profile.historyRange}>
            History
          </SectionHeading>

          <div>
            {experiences.map((experience) => (
              <ExperienceCard
                key={`${experience.company}-${experience.role}`}
                experience={experience}
              />
            ))}
          </div>
        </section>

        <ContactSection />
      </div>
      <div data-spacer="" aria-hidden="true" />
    </main>
  );
}
