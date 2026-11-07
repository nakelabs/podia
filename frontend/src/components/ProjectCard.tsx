import React from "react";
import { FileText, Github, Play } from "lucide-react";
import { Project } from "../types";

interface ProjectCardProps {
  project: Project;
  onSelectProject: (project: Project) => void;
  onSelectStackTag?: (stack: string) => void;
}

// Render equal-height monochrome project card with neutral placement badge and stack tags
export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelectProject,
  onSelectStackTag,
}) => {
  const verified =
    project.verification_status === "platform_verified" ||
    project.verification_status === "credential_verified";

  return (
    <article
      onClick={() => onSelectProject(project)}
      className="group flex h-full cursor-pointer flex-col justify-between rounded-md border border-[#30363d] bg-[#161b22] p-5 transition hover:border-[#f0f6fc]"
    >
      {/* Top Content Block */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          {/* Metadata line: Hackathon + Year on left, monochrome Placement pill on right */}
          <div className="mb-3 flex items-center justify-between gap-2 font-mono text-xs text-[#8b949e]">
            <span className="truncate">
              {project.hackathon?.name || "Hackathon"} · {project.hackathon?.year || 2025}
            </span>
              <span className="shrink-0 rounded border border-[#30363d] bg-[#0d1117] px-2 py-0.5 font-mono text-[11px] text-[#f0f6fc]">
                {project.placement}
              </span>
          </div>

          {/* Title and Track */}
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <h3 className="text-base font-semibold text-[#f0f6fc]">{project.project_name}</h3>
            <span className="shrink-0 font-mono text-[11px] text-[#8b949e]">
              {project.track}
              {verified ? " · Verified" : ""}
            </span>
          </div>

          {/* Clean 2-line problem/tagline description */}
          <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-[#8b949e]">
            {project.tagline}
          </p>
        </div>

        {/* Monochrome tech stack list pinned right above the footer */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.tech_stack.map((tech) => (
            <button
              key={tech}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectStackTag?.(tech);
              }}
              className="rounded border border-[#30363d] bg-[#0d1117] px-2 py-0.5 font-mono text-[11px] text-[#8b949e] transition hover:border-[#f0f6fc] hover:text-[#f0f6fc]"
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      {/* Pinned Footer Row: Distinct icon tap targets + monochrome Details → trigger */}
      <div className="flex items-center justify-between border-t border-[#30363d] pt-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 rounded border border-[#30363d] bg-[#0d1117] px-2 py-1 text-[11px] text-[#8b949e] transition hover:border-[#8b949e] hover:text-[#f0f6fc]"
            >
              <Github className="h-3 w-3" />
              <span>Code</span>
            </a>
          )}
          {project.pitch_deck_url && (
            <a
              href={project.pitch_deck_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 rounded border border-[#30363d] bg-[#0d1117] px-2 py-1 text-[11px] text-[#8b949e] transition hover:border-[#8b949e] hover:text-[#f0f6fc]"
            >
              <FileText className="h-3 w-3" />
              <span>Deck</span>
            </a>
          )}
          {project.video_url && (
            <a
              href={project.video_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 rounded border border-[#30363d] bg-[#0d1117] px-2 py-1 text-[11px] text-[#8b949e] transition hover:border-[#8b949e] hover:text-[#f0f6fc]"
            >
              <Play className="h-3 w-3" />
              <span>Video</span>
            </a>
          )}
        </div>

          <span className="font-medium text-[#8b949e] transition group-hover:text-[#f0f6fc]">
            Details →
          </span>
      </div>
    </article>
  );
};
