import React, { useEffect, useMemo, useRef, useState } from "react";
import { Project } from "../types";

interface CommandPaletteProps {
  isOpen: boolean;
  projects: Project[];
  onClose: () => void;
  onSelectProject: (project: Project) => void;
  onApplySearchQuery: (query: string) => void;
}

// Render global ⌘K / Ctrl+K spotlight search overlay with strict 3-color styling and no icons
export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  projects,
  onClose,
  onSelectProject,
  onApplySearchQuery,
}) => {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter projects in real time across project names, tracks, hackathons, and tech stacks
  const filteredProjects = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return projects;
    return projects.filter((project) => {
      const searchable = [
        project.project_name,
        project.tagline,
        project.track,
        project.placement,
        project.hackathon?.name || "",
        ...project.tech_stack,
      ]
        .join(" ")
        .toLowerCase();
      return searchable.includes(trimmed);
    });
  }, [projects, query]);

  // Focus input and reset selection index when the spotlight overlay opens
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [isOpen]);

  // Reset active highlight when filtered results change
  useEffect(() => {
    setActiveIndex(0);
  }, [filteredProjects.length]);

  // Handle ArrowUp, ArrowDown, Enter, and Escape keys inside the command palette
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (filteredProjects.length > 0) {
        setActiveIndex((prev) => (prev + 1) % filteredProjects.length);
      }
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (filteredProjects.length > 0) {
        setActiveIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
      }
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const selected = filteredProjects[activeIndex];
      if (selected) {
        onSelectProject(selected);
        onClose();
      } else if (query.trim()) {
        onApplySearchQuery(query.trim());
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-20 sm:pt-28"
    >
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/75" />

      {/* Command Bar Modal */}
        <div className="relative z-10 w-full max-w-xl overflow-hidden rounded border border-[#30363d] bg-[#161b22]">
          {/* Search Input Header */}
            <div className="flex items-center justify-between gap-3 border-b border-[#30363d] px-4 py-3">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects, stacks, or hackathons..."
                className="w-full bg-transparent text-sm text-[#f0f6fc] placeholder-[#8b949e] focus:outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                className="font-mono text-xs text-[#8b949e] hover:text-[#f0f6fc]"
              >
                ESC
              </button>
            </div>

            {/* Results List */}
              <div className="max-h-80 overflow-y-auto p-2">
                {filteredProjects.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#8b949e]">
                      No matching projects for "{query}".
                    </div>
                    ) : (
                    <ul className="space-y-1">
                      {filteredProjects.map((project, index) => {
                        const isSelected = index === activeIndex;
                        return (
                          <li key={project.id}>
                            <button
                              type="button"
                              onMouseEnter={() => setActiveIndex(index)}
                              onClick={() => {
                                onSelectProject(project);
                                onClose();
                              }}
                      className={`flex w-full items-center justify-between gap-4 rounded px-3 py-2.5 text-left transition ${isSelected ? "bg-[#0d1117] text-[#f0f6fc]" : "text-[#8b949e]"
                                }`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-[#f0f6fc]">
                                      {project.project_name}
                                    </span>
                                      <span className="font-mono text-xs text-[#8b949e]">
                                        · {project.placement}
                                      </span>
                                    </div>
                                    <p className="truncate text-xs text-[#8b949e]">{project.tagline}</p>
                                </div>

                                <span className="shrink-0 font-mono text-xs text-[#8b949e]">
                                  {project.tech_stack.slice(0, 2).join(", ")}
                                </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
          )}
                  </div>

        {/* Command Palette Footer */}
                  <div className="flex items-center justify-between border-t border-[#30363d] bg-[#0d1117] px-4 py-2 font-mono text-[11px] text-[#8b949e]">
                    <span>↑↓ navigate · ↵ open · esc close</span>
                    <span>podia.dev</span>
                  </div>
                </div>
              </div>
              );
};
