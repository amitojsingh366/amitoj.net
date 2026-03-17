import { HeroSection } from "@/components/HeroSection";
import { ProjectCard } from "@/components/ProjectCard";
import { ExperienceCard } from "@/components/ExperienceCard";
import { ScrollHashUpdater } from "@/components/ScrollHashUpdater";
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
      <HeroSection />

      <section
        id="projects"
        className="px-6 py-20 min-h-screen max-w-5xl mx-auto flex flex-col justify-center"
        style={{ scrollSnapAlign: "start" }}
      >
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </section>

      <section
        id="experience"
        className="px-6 py-20 min-h-screen max-w-5xl mx-auto flex flex-col justify-center"
        style={{ scrollSnapAlign: "start" }}
      >
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

        <div className="space-y-6">
          {experiences.map((exp) => (
            <ExperienceCard key={exp.company} experience={exp} />
          ))}
        </div>
      </section>
    </main>
  );
}
