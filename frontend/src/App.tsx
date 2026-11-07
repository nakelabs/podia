import React, { useCallback, useEffect, useMemo, useState } from "react";
import { fetchProjects, submitProject } from "./api";
import { CommandPalette } from "./components/CommandPalette";
import { FilterRibbon, TRACK_OPTIONS } from "./components/FilterRibbon";
import { Navbar } from "./components/Navbar";
import { ProjectCard } from "./components/ProjectCard";
import { ProjectDrawer } from "./components/ProjectDrawer";
import { Project, ProjectCreatePayload } from "./types";

// Define initial form state for submitting a new hackathon winning build
const INITIAL_SUBMIT_FORM: ProjectCreatePayload = {
  project_name: "",
  tagline: "",
  track: "AI/ML",
  placement: "1st Place",
  problem_statement: "",
  solution_summary: "",
  key_differentiator: "",
  tech_stack: [],
  repo_url: "",
  demo_url: "",
  pitch_deck_url: "",
  video_url: "",
  proof_url: "",
  hackathon_name: "",
  hackathon_organizer: "",
  hackathon_year: 2026,
  hackathon_region: "Global",
};

// Coordinate live API data, search, filter state, project drawer, command palette, and submission modal
export const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active search & filter states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTrack, setSelectedTrack] = useState<string>("All");
  const [selectedPlacement, setSelectedPlacement] = useState<string>("All");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedStack, setSelectedStack] = useState<string>("All");

  // Overlay states for Anatomy Drawer, Command Palette, and Submit Modal
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isCommandOpen, setIsCommandOpen] = useState<boolean>(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState<boolean>(false);
  const [submitForm, setSubmitForm] = useState<ProjectCreatePayload>(INITIAL_SUBMIT_FORM);
  const [stackInput, setStackInput] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load projects matching active filters from the hosted Render FastAPI backend
  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchProjects({
        q: searchQuery,
        track: selectedTrack,
        placement: selectedPlacement,
        region: selectedRegion,
        tech_stack: selectedStack,
      });
      setProjects(data);
    } catch {
      setErrorMessage("Unable to reach https://podia.onrender.com. Please try again shortly.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedTrack, selectedPlacement, selectedRegion, selectedStack]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Register global ⌘K / Ctrl+K keyboard shortcut to toggle the spotlight CommandPalette
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Compute dynamic list of all hackathon sectors combining defaults and indexed projects
  const availableTracks = useMemo(() => {
    const set = new Set<string>(TRACK_OPTIONS);
    projects.forEach((p) => {
      if (p.track?.trim()) set.add(p.track.trim());
    });
    return Array.from(set);
  }, [projects]);

  // Compute unique sorted list of tech stack tags across live indexed projects
  const availableStacks = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.tech_stack.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [projects]);

  // Check whether any search or filter is currently applied
  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedTrack !== "All" ||
    selectedPlacement !== "All" ||
    selectedRegion !== "All" ||
    selectedStack !== "All";

  // Reset all active search queries and ribbon filters
  const handleClearAllFilters = () => {
    setSearchQuery("");
    setSelectedTrack("All");
    setSelectedPlacement("All");
    setSelectedRegion("All");
    setSelectedStack("All");
  };

  // Handle submitting a new community winning project directly to the Render backend
  const handleCreateProject = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    const parsedStack = stackInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      const created = await submitProject({
        ...submitForm,
        tech_stack: parsedStack,
      });
      setIsSubmitOpen(false);
      setSubmitForm(INITIAL_SUBMIT_FORM);
      setStackInput("");
      await loadProjects();
      setActiveProject(created);
    } catch {
      setSubmitError("Failed to submit project to the API. Please check your inputs and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="top" className="min-h-screen bg-[#0d1117] text-[#f0f6fc]">
      {/* Top Navigation Bar */}
      <Navbar
        onOpenCommandPalette={() => setIsCommandOpen(true)}
        onOpenSubmitModal={() => setIsSubmitOpen(true)}
      />

      {/* Editorial Header Section with Live Stats Ticker */}
      <section className="border-b border-[#30363d] bg-[#0d1117] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <h1 className="text-2xl font-semibold tracking-tight text-[#f0f6fc] sm:text-3xl">
              Deconstruct How Winning Hackathon Projects Were Built.
            </h1>

            <p className="mt-2.5 text-sm leading-relaxed text-[#8b949e]">
              Explore winning 1st, 2nd, and 3rd place builds across AI, Privacy, Climate, and
              Health. Inspect system architecture, pitch decks, repositories, and judge takeaways.
            </p>

            {/* Compact inline stats ticker reflecting live database state */}
            <p className="mt-4 font-mono text-xs text-[#8b949e]">
              <span className="text-[#f0f6fc]">
                {projects.length} {projects.length === 1 ? "build" : "builds"} indexed
              </span>{" "}
              across <span className="text-[#f0f6fc]">{availableTracks.length - 1}+ sectors</span>
              {" · "}
              <span>1st–3rd place podiums</span>
              {" · "}
              <span>100% open source</span>
              {searchQuery && (
                <>
                  {" · "}
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-[#f0f6fc] underline"
                  >
                    Filter: "{searchQuery}" (clear)
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Single-Row Filter Ribbon */}
      <FilterRibbon
        selectedTrack={selectedTrack}
        selectedPlacement={selectedPlacement}
        selectedRegion={selectedRegion}
        selectedStack={selectedStack}
        availableTracks={availableTracks}
        availableStacks={availableStacks}
        onSelectTrack={setSelectedTrack}
        onSelectPlacement={setSelectedPlacement}
        onSelectRegion={setSelectedRegion}
        onSelectStack={setSelectedStack}
        onClearAll={handleClearAllFilters}
      />

      {/* Main Project Archive Grid */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-64 animate-pulse rounded-md border border-[#30363d] bg-[#161b22] p-5"
              />
            ))}
          </div>
        ) : errorMessage ? (
          <div className="rounded-md border border-[#30363d] bg-[#161b22] p-10 text-center">
            <h2 className="text-sm font-medium text-[#f0f6fc]">{errorMessage}</h2>
            <button
              type="button"
              onClick={loadProjects}
              className="mt-4 rounded border border-[#f0f6fc] px-3 py-1.5 font-mono text-xs text-[#f0f6fc] transition hover:bg-[#f0f6fc] hover:text-[#0d1117]"
            >
              Retry Connection
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-md border border-[#30363d] bg-[#161b22] p-10 text-center">
            <h2 className="text-sm font-medium text-[#f0f6fc]">
              {hasActiveFilters
                ? "No winning builds match these filters"
                : "No winning builds have been submitted yet"}
            </h2>
            <p className="mt-1 text-xs text-[#8b949e]">
              {hasActiveFilters
                ? "Reset your active sector, placement, or stack filters to view all projects."
                : "Be the first to index a winning hackathon project in the archive."}
            </p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="mt-4 rounded border border-[#f0f6fc] px-3 py-1.5 font-mono text-xs text-[#f0f6fc] transition hover:bg-[#f0f6fc] hover:text-[#0d1117]"
              >
                Reset filters
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsSubmitOpen(true)}
                className="mt-4 rounded border border-[#f0f6fc] bg-[#f0f6fc] px-4 py-1.5 font-mono text-xs font-medium text-[#0d1117] transition hover:bg-[#f0f6fc]/90"
              >
                Submit a Win
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelectProject={setActiveProject}
                onSelectStackTag={(stack) => setSelectedStack(stack)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Full-Screen Anatomy of the Win Detail View */}
      <ProjectDrawer project={activeProject} onClose={() => setActiveProject(null)} />

      {/* ⌘K / Ctrl+K Spotlight Command Palette */}
      <CommandPalette
        isOpen={isCommandOpen}
        projects={projects}
        onClose={() => setIsCommandOpen(false)}
        onSelectProject={(project) => setActiveProject(project)}
        onApplySearchQuery={(q) => setSearchQuery(q)}
      />

      {/* Submit a Winning Project Modal */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsSubmitOpen(false)} className="fixed inset-0 bg-black/75" />
          <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded border border-[#30363d] bg-[#161b22] p-6">
            <div className="mb-4 flex items-center justify-between border-b border-[#30363d] pb-3">
              <div>
                <h2 className="text-sm font-semibold text-[#f0f6fc]">Submit a Winning Build</h2>
                <p className="text-xs text-[#8b949e]">
                  New submissions enter the archive as unverified until reviewed.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitOpen(false)}
                className="font-mono text-xs text-[#8b949e] hover:text-[#f0f6fc]"
              >
                Close
              </button>
            </div>

            {submitError && (
              <div className="mb-3 rounded border border-[#30363d] bg-[#0d1117] p-2.5 font-mono text-xs text-[#f0f6fc]">
                {submitError}
              </div>
            )}

            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block font-mono text-[#8b949e]">Project Name *</label>
                  <input
                    required
                    type="text"
                    value={submitForm.project_name}
                    onChange={(e) =>
                      setSubmitForm({ ...submitForm, project_name: e.target.value })
                    }
                    placeholder="Project title"
                    className="w-full rounded border border-[#30363d] bg-[#0d1117] px-3 py-1.5 text-[#f0f6fc] focus:border-[#f0f6fc] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[#8b949e]">Hackathon Event *</label>
                  <input
                    required
                    type="text"
                    value={submitForm.hackathon_name}
                    onChange={(e) =>
                      setSubmitForm({ ...submitForm, hackathon_name: e.target.value })
                    }
                    placeholder="Hackathon name"
                    className="w-full rounded border border-[#30363d] bg-[#0d1117] px-3 py-1.5 text-[#f0f6fc] focus:border-[#f0f6fc] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block font-mono text-[#8b949e]">
                    Sector / Track (select or type) *
                  </label>
                  <input
                    required
                    list="hackathon-sectors-list"
                    value={submitForm.track}
                    onChange={(e) => setSubmitForm({ ...submitForm, track: e.target.value })}
                    placeholder="e.g., AI/ML, Robotics"
                    className="w-full rounded border border-[#30363d] bg-[#0d1117] px-2.5 py-1.5 text-[#f0f6fc] focus:border-[#f0f6fc] focus:outline-none"
                  />
                  <datalist id="hackathon-sectors-list">
                    {availableTracks
                      .filter((t) => t !== "All")
                      .map((track) => (
                        <option key={track} value={track} />
                      ))}
                  </datalist>
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[#8b949e]">Placement *</label>
                  <select
                    value={submitForm.placement}
                    onChange={(e) => setSubmitForm({ ...submitForm, placement: e.target.value })}
                    className="w-full rounded border border-[#30363d] bg-[#0d1117] px-2.5 py-1.5 text-[#f0f6fc]"
                  >
                    <option value="1st Place">1st Place</option>
                    <option value="2nd Place">2nd Place</option>
                    <option value="3rd Place">3rd Place</option>
                    <option value="Grand Prize">Grand Prize</option>
                    <option value="Track Winner">Track Winner</option>
                    <option value="Finalist">Finalist</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[#8b949e]">Region</label>
                  <select
                    value={submitForm.hackathon_region}
                    onChange={(e) =>
                      setSubmitForm({ ...submitForm, hackathon_region: e.target.value })
                    }
                    className="w-full rounded border border-[#30363d] bg-[#0d1117] px-2.5 py-1.5 text-[#f0f6fc]"
                  >
                    <option value="Global">Global</option>
                    <option value="North America">North America</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia">Asia</option>
                    <option value="Africa">Africa</option>
                    <option value="Latin America">Latin America</option>
                    <option value="Middle East">Middle East</option>
                    <option value="Oceania">Oceania</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block font-mono text-[#8b949e]">One-Line Tagline *</label>
                <input
                  required
                  type="text"
                  value={submitForm.tagline}
                  onChange={(e) => setSubmitForm({ ...submitForm, tagline: e.target.value })}
                  placeholder="Concise summary of what the build does"
                  className="w-full rounded border border-[#30363d] bg-[#0d1117] px-3 py-1.5 text-[#f0f6fc] focus:border-[#f0f6fc] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block font-mono text-[#8b949e]">
                  The Problem Statement *
                </label>
                <textarea
                  required
                  rows={2}
                  value={submitForm.problem_statement}
                  onChange={(e) =>
                    setSubmitForm({ ...submitForm, problem_statement: e.target.value })
                  }
                  placeholder="What specific pain point did this project solve?"
                  className="w-full rounded border border-[#30363d] bg-[#0d1117] px-3 py-1.5 text-[#f0f6fc] focus:border-[#f0f6fc] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block font-mono text-[#8b949e]">
                  Solution & Architecture *
                </label>
                <textarea
                  required
                  rows={2}
                  value={submitForm.solution_summary}
                  onChange={(e) =>
                    setSubmitForm({ ...submitForm, solution_summary: e.target.value })
                  }
                  placeholder="How was the system architected?"
                  className="w-full rounded border border-[#30363d] bg-[#0d1117] px-3 py-1.5 text-[#f0f6fc] focus:border-[#f0f6fc] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block font-mono text-[#8b949e]">
                  Why It Won (Key Differentiator) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={submitForm.key_differentiator}
                  onChange={(e) =>
                    setSubmitForm({ ...submitForm, key_differentiator: e.target.value })
                  }
                  placeholder="What stood out to the judges?"
                  className="w-full rounded border border-[#30363d] bg-[#0d1117] px-3 py-1.5 text-[#f0f6fc] focus:border-[#f0f6fc] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block font-mono text-[#8b949e]">
                  Tech Stack (comma-separated) *
                </label>
                <input
                  required
                  type="text"
                  value={stackInput}
                  onChange={(e) => setStackInput(e.target.value)}
                  placeholder="FastAPI, React, PyTorch"
                  className="w-full rounded border border-[#30363d] bg-[#0d1117] px-3 py-1.5 font-mono text-[#f0f6fc] focus:border-[#f0f6fc] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block font-mono text-[#8b949e]">GitHub Repo URL</label>
                  <input
                    type="url"
                    value={submitForm.repo_url}
                    onChange={(e) => setSubmitForm({ ...submitForm, repo_url: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full rounded border border-[#30363d] bg-[#0d1117] px-3 py-1.5 text-[#f0f6fc]"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[#8b949e]">Winner Proof URL</label>
                  <input
                    type="url"
                    value={submitForm.proof_url}
                    onChange={(e) => setSubmitForm({ ...submitForm, proof_url: e.target.value })}
                    placeholder="https://devpost.com/software/..."
                    className="w-full rounded border border-[#30363d] bg-[#0d1117] px-3 py-1.5 text-[#f0f6fc]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsSubmitOpen(false)}
                  className="rounded border border-[#30363d] bg-[#0d1117] px-3.5 py-1.5 text-xs text-[#8b949e] hover:text-[#f0f6fc]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded border border-[#f0f6fc] bg-[#f0f6fc] px-4 py-1.5 text-xs font-medium text-[#0d1117] hover:bg-[#f0f6fc]/90 disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Build"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
