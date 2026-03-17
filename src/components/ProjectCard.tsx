import { FaGithub } from "react-icons/fa";
import type { Project } from "@/data/projects";

const gradientClasses =
  "text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/50 p-6 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600">
      <div className="flex items-start justify-between mb-3">
        <h3 className={`text-lg font-semibold ${gradientClasses}`}>
          {project.name}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {project.year}
          </span>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="View on GitHub"
            >
              <FaGithub className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <span
            key={t}
            className="text-xs px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-400 font-medium"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
