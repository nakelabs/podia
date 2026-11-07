import React, { useEffect } from "react";
import { Project } from "../types";

interface ProjectDrawerProps {
  project: Project | null;
  onClose: () => void;
}

// Render full-screen competitive intelligence overlay with monochrome 2/3 breakdown and sticky 1/3 sidebar
export const ProjectDrawer: React.FC<ProjectDrawerProps> = ({ project, onClose }) => {
  // Listen for Escape key and lock background body scroll while overlay is open
  useEffect(() => {
    if (!project) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-[100] overflow-y-auto bg-[#0d1117] text-[#f0f6fc]"
            >
              <div className="min-h-screen w-full bg-[#0d1117] pb-24">
                {/* Sticky Top Bar: Breadcrumb on left, single Close [ESC] control on right */}
                <header className="sticky top-0 z-20 border-b border-[#30363d] bg-[#0d1117]/95 backdrop-blur">
                  <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
                    <div className="flex items-center gap-2 truncate font-mono text-xs text-[#8b949e]">
                      <span className="text-[#f0f6fc]">podia.dev</span>
                      <span>/</span>
                      <span className="truncate">
                        {project.hackathon?.name || "Hackathon Archive"} · {project.hackathon?.year || 2025}
                      </span>
                      <span>/</span>
                      <span className="truncate text-[#f0f6fc]">{project.project_name}</span>
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex shrink-0 items-center gap-2 rounded border border-[#30363d] bg-[#161b22] px-3 py-1.5 font-mono text-xs text-[#8b949e] transition hover:border-[#f0f6fc] hover:text-[#f0f6fc]"
                    >
                      <span aria-hidden="true">✕</span>
                      <span>Close [ESC]</span>
                    </button>
                  </div>
              </header>

                  {/* Main Content Container */}
                  <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
                    {/* Project Header & Podium Badge */}
                    <div className="border-b border-[#30363d] pb-7">
                      <div className="mb-3 flex flex-wrap items-center gap-2.5 font-mono text-xs text-[#8b949e]">
                        <span className="rounded border border-[#f0f6fc]/40 bg-[#161b22] px-2 py-0.5 font-mono text-xs text-[#f0f6fc]">
                          {project.placement}
                        </span>
                        <span>·</span>
                        <span>{project.hackathon?.name || "Hackathon Archive"}</span>
                        <span>·</span>
                        <span>{project.hackathon?.year || 2025}</span>
                        <span>·</span>
                        <span className="rounded border border-[#30363d] bg-[#161b22] px-2 py-0.5 text-[#8b949e]">
                          {project.track}
                        </span>
                      </div>

                      <h1 className="text-2xl font-semibold tracking-tight text-[#f0f6fc] sm:text-4xl">
                        {project.project_name}
                      </h1>

                    <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[#8b949e] sm:text-base">
                      {project.tagline}
                    </p>
                  </div>

                      {/* Desktop 2/3 Left Column + Sticky 1/3 Right Sidebar */}
                      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
                        {/* Left 2/3 Column (8 cols): Problem, Architecture, and Why It Won */}
                        <div className="space-y-6 lg:col-span-8">
                          {/* 01. The Problem */}
                          <section className="rounded-md border border-[#30363d] bg-[#161b22] p-6">
                            <h2 className="mb-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
                              01. The Problem
                            </h2>
                            <p className="text-sm leading-relaxed text-[#f0f6fc]/90 sm:text-base">
                              {project.problem_statement}
                            </p>
                          </section>

                          {/* 02. Solution & Architecture */}
                          <section className="rounded-md border border-[#30363d] bg-[#161b22] p-6">
                            <h2 className="mb-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
                              02. Solution & Architecture
                            </h2>
                            <p className="text-sm leading-relaxed text-[#f0f6fc]/90 sm:text-base">
                              {project.solution_summary}
                            </p>
                          </section>

                          {/* 03. Why It Won / Judge Differentiator */}
                          <section className="rounded-md border border-[#f0f6fc]/40 bg-[#161b22] p-6">
                            <div className="mb-2.5 flex items-center justify-between gap-2">
                              <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#f0f6fc]">
                                03. Why It Won / Judge Differentiator
                              </h2>
                              <span className="font-mono text-[11px] text-[#8b949e]">
                                Competitive Intelligence
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed text-[#f0f6fc] sm:text-base">
                              {project.key_differentiator}
                            </p>
                          </section>
                        </div>

                          {/* Right 1/3 Sticky Sidebar (4 cols): Tech Stack, Event Metadata & Proof of Win */}
                          <aside className="space-y-6 lg:sticky lg:top-20 lg:col-span-4">
                            {/* Tech Stack Box */}
                            <section className="rounded-md border border-[#30363d] bg-[#161b22] p-5">
                              <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
                                Tech Stack
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {project.tech_stack.map((tech) => (
                                  <span
                                    key={tech}
                                    className="rounded border border-[#30363d] bg-[#0d1117] px-2.5 py-1 font-mono text-xs text-[#f0f6fc]"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </section>

                                  {/* Event Metadata Box */}
                                  <section className="rounded-md border border-[#30363d] bg-[#161b22] p-5">
                                    <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
                                      Event Metadata
                                    </h3>
                                    <dl className="space-y-2.5 text-xs">
                                      <div className="flex justify-between gap-2 border-b border-[#30363d] pb-2">
                                        <dt className="font-mono text-[#8b949e]">Hackathon</dt>
                                        <dd className="text-right font-medium text-[#f0f6fc]">
                                          {project.hackathon?.name || "Hackathon Archive"}
                                        </dd>
                                      </div>
                                      <div className="flex justify-between gap-2 border-b border-[#30363d] pb-2">
                                        <dt className="font-mono text-[#8b949e]">Organizer</dt>
                                        <dd className="text-right text-[#f0f6fc]">
                                          {project.hackathon?.organizer || "Community"}
                                        </dd>
                                      </div>
                                      <div className="flex justify-between gap-2 border-b border-[#30363d] pb-2">
                                        <dt className="font-mono text-[#8b949e]">Placement</dt>
                                        <dd className="text-right">
                                          <span className="rounded border border-[#30363d] bg-[#0d1117] px-2 py-0.5 font-mono text-xs text-[#f0f6fc]">
                                            {project.placement}
                                          </span>
                                    </dd>
                                  </div>
                                  <div className="flex justify-between gap-2 border-b border-[#30363d] pb-2">
                                    <dt className="font-mono text-[#8b949e]">Sector</dt>
                                    <dd className="font-mono text-right text-[#f0f6fc]">{project.track}</dd>
                                  </div>
                                  <div className="flex justify-between gap-2">
                                    <dt className="font-mono text-[#8b949e]">Region · Year</dt>
                                    <dd className="font-mono text-right text-[#f0f6fc]">
                                      {project.hackathon?.region || "Global"} · {project.hackathon?.year || 2025}
                                    </dd>
                                  </div>
                                </dl>
                            </section>

                              {/* Proof of Win / Official Links Box */}
                              <section className="rounded-md border border-[#30363d] bg-[#161b22] p-5">
                                <div className="mb-3 flex items-center justify-between font-mono text-xs">
                                  <h3 className="font-semibold uppercase tracking-wider text-[#8b949e]">
                                    Proof of Win & Links
                                  </h3>
                                  <span className="rounded border border-[#30363d] bg-[#0d1117] px-2 py-0.5 text-[11px] text-[#f0f6fc]">
                                    {project.verification_status}
                                  </span>
                                </div>

                                <div className="flex flex-col gap-2 font-mono text-xs">
                                  {project.repo_url && (
                                    <a
                                      href={project.repo_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-between rounded border border-[#f0f6fc] bg-[#f0f6fc] px-3.5 py-2 font-medium text-[#0d1117] transition hover:bg-[#f0f6fc]/90"
                                    >
                                      <span>View Source Code</span>
                                      <span>↗</span>
                                    </a>
                                  )}

                                  {project.pitch_deck_url && (
                                    <a
                                      href={project.pitch_deck_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-between rounded border border-[#30363d] bg-[#0d1117] px-3.5 py-2 text-[#f0f6fc] transition hover:border-[#f0f6fc]"
                                    >
                                      <span>Pitch Deck</span>
                                      <span>↗</span>
                                    </a>
                                  )}

                                  {project.video_url && (
                                    <a
                                      href={project.video_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-between rounded border border-[#30363d] bg-[#0d1117] px-3.5 py-2 text-[#f0f6fc] transition hover:border-[#f0f6fc]"
                                    >
                                      <span>Watch Video Demo</span>
                                      <span>↗</span>
                                    </a>
                                  )}

                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded border border-[#30363d] bg-[#0d1117] px-3.5 py-2 text-[#f0f6fc] transition hover:border-[#f0f6fc]"
                      >
                        <span>Live Deployment</span>
                        <span>↗</span>
                      </a>
                    )}

                    {project.proof_url && (
                      <a
                        href={project.proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 flex items-center justify-between rounded border border-[#30363d] bg-[#0d1117] px-3.5 py-2 text-[#8b949e] transition hover:border-[#f0f6fc] hover:text-[#f0f6fc]"
                      >
                        <span>Official Winner Record / Devpost</span>
                        <span>↗</span>
                      </a>
                    )}
                  </div>
                </section>
              </aside>
            </div>
          </div>
      </div>
    </div>
  );
};
