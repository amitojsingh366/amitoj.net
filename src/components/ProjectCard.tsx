import { FaGithub } from "react-icons/fa";
import type { Project } from "@/data/projects";
import { FiGlobe } from "react-icons/fi";

const gradientClasses =
  "text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/50 p-6 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-violet-500/5">
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
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              title={`Visit ${project.name}`}
            >
              <FiGlobe className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>

      <ul className="mt-4 mb-4 space-y-2">
        {project.bullets.map((bullet, i) => (
          <li
            key={i}
            className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex"
          >
            <span className="text-violet-500 mr-2 mt-0.5 shrink-0">&bull;</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

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
