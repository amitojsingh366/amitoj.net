import { FaGithub } from "react-icons/fa";
import type { Experience } from "@/data/experience";
import { FiGlobe } from "react-icons/fi";

const gradientClasses =
  "text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400";

export function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/50 p-6 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-1">
        <div>
          <h3 className={`text-lg font-semibold ${gradientClasses}`}>
            {experience.role}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <p className={`text-sm font-medium ${gradientClasses}`}>
              {experience.company}
            </p>
            <span className="text-gray-400 dark:text-gray-500 text-sm">
              &middot; {experience.location}
            </span>
            {experience.link && (
              <a
                href={experience.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                title={`Visit ${experience.company}`}
              >
                <FiGlobe className="w-4 h-4" />
              </a>
            )}
            {experience.github && (
              <a
                href={experience.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="View on GitHub"
              >
                <FaGithub className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0 whitespace-nowrap">
          {experience.period}
        </span>
      </div>

      <ul className="mt-4 space-y-2">
        {experience.bullets.map((bullet, i) => (
          <li
            key={i}
            className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex"
          >
            <span className="text-violet-500 mr-2 mt-0.5 shrink-0">
              &bull;
            </span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
