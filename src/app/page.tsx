import { HeroSection } from "@/components/HeroSection";
import { ProjectCard } from "@/components/ProjectCard";
import { ExperienceCard } from "@/components/ExperienceCard";
import { ScrollHashUpdater } from "@/components/ScrollHashUpdater";
import { HeroProjectsSnap } from "@/components/HeroProjectsSnap";
import { FadeIn } from "@/components/FadeIn";
import { Footer } from "@/components/Footer";
import {
  GradientColor,
  GradientDirection,
  GradientText,
} from "@/components/GradientText";
import { projects } from "@/data/projects";
import { experiences } from "@/data/experience";

const glowStyle = { textShadow: "0px 0px 50px rgba(139, 92, 246, 0.4)" };

export default function Home() {
  return (
    <main>
      <ScrollHashUpdater />
      <HeroProjectsSnap />
      <HeroSection />

      <section
        id="projects"
        className="px-6 py-10 min-h-screen max-w-5xl mx-auto flex flex-col justify-center"
      >
        <FadeIn>
          <GradientText
            size="text-3xl md:text-4xl"
            fontWeight="font-bold"
            colors={GradientColor["violet-cyan"]}
            direction={GradientDirection.right}
            className="mb-10"
            style={glowStyle}
          >
            Projects
          </GradientText>
        </FadeIn>

        <div className="space-y-6">
          {projects.map((project, i) => (
            <FadeIn key={project.name} delay={i * 100}>
              <ProjectCard project={project} />
            </FadeIn>
          ))}
        </div>
      </section>

      <section
        id="experience"
        className="px-6 py-10 min-h-screen max-w-5xl mx-auto flex flex-col justify-center snap-start"
      >
        <FadeIn>
          <GradientText
            size="text-3xl md:text-4xl"
            fontWeight="font-bold"
            colors={GradientColor["violet-cyan"]}
            direction={GradientDirection.right}
            className="mb-10"
            style={glowStyle}
          >
            Experience
          </GradientText>
        </FadeIn>

        <div className="space-y-6">
          {experiences.map((exp, i) => (
            <FadeIn key={`${exp.company}-${exp.role}`} delay={i * 100}>
              <ExperienceCard experience={exp} />
            </FadeIn>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
