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
    <main className="pixel-site">
      <PixelGridCanvas />
      <SiteNav />

      <div className="smooth-layer" data-smooth="">
        <HeroSection />

        <section id="projects" className="page-section page-container">
          <SectionHeading number="01">Work</SectionHeading>

          <div className="project-track" data-wire-track="">
            <div className="project-track__rail" aria-hidden="true">
              <span data-wire-line="" />
              <span data-wire-fill="" />
            </div>
            <div>
              {projects.map((project, i) => (
                <ProjectCard key={project.name} project={project} index={i} />
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="page-section page-container history-section">
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
