import axios from "axios";
import { MOCK_PROJECTS } from "./mockData";
import { Project, ProjectCreatePayload, ProjectFilterParams } from "./types";

// Configure Axios client with backend base URL and reasonable timeout for offline fallback
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  timeout: 3500,
  headers: {
    "Content-Type": "application/json",
  },
});

// Keep an in-memory copy of mock projects so offline submissions also appear in the session
let localProjectsCache: Project[] = [...MOCK_PROJECTS];

// Filter local fallback projects when the FastAPI backend is offline
export function filterLocalProjects(params: ProjectFilterParams = {}): Project[] {
  const { q, track, placement, region, tech_stack } = params;

  return localProjectsCache.filter((project) => {
    if (q && q.trim() !== "") {
      const needle = q.trim().toLowerCase();
      const haystack = [
        project.project_name,
        project.tagline,
        project.problem_statement,
        project.solution_summary,
        project.key_differentiator,
        project.hackathon?.name || "",
        ...project.tech_stack,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(needle)) {
        return false;
      }
    }

    if (track && track !== "All") {
      const normTrack = track.toLowerCase();
      const projectTrack = project.track.toLowerCase();
      const matchesTrack =
        projectTrack.includes(normTrack) ||
        (normTrack === "ai/ml" &&
          (projectTrack.includes("ai") ||
            project.tech_stack.some((t) => t.toLowerCase().includes("pytorch"))));
      if (!matchesTrack) {
        return false;
      }
    }

    if (placement && placement !== "All") {
      if (!project.placement.toLowerCase().includes(placement.toLowerCase())) {
        return false;
      }
    }

    if (region && region !== "All") {
      const projectRegion = project.hackathon?.region?.toLowerCase() || "";
      if (!projectRegion.includes(region.toLowerCase())) {
        return false;
      }
    }

    if (tech_stack && tech_stack !== "All") {
      const hasStack = project.tech_stack.some((item) =>
        item.toLowerCase().includes(tech_stack.toLowerCase())
      );
      if (!hasStack) {
        return false;
      }
    }

    return true;
  });
}

// Fetch projects from the FastAPI backend with automatic fallback to mockData if unreachable
export async function fetchProjects(
  params: ProjectFilterParams = {}
): Promise<{ projects: Project[]; isOffline: boolean }> {
  try {
    const cleanParams: Record<string, string> = {};
    if (params.q?.trim()) cleanParams.q = params.q.trim();
    if (params.track && params.track !== "All") cleanParams.track = params.track;
    if (params.placement && params.placement !== "All") cleanParams.placement = params.placement;
    if (params.region && params.region !== "All") cleanParams.region = params.region;
    if (params.tech_stack && params.tech_stack !== "All") cleanParams.tech_stack = params.tech_stack;

    const response = await apiClient.get<Project[]>("/projects", { params: cleanParams });
    return { projects: response.data, isOffline: false };
  } catch {
    return { projects: filterLocalProjects(params), isOffline: true };
  }
}

// Fetch a single project by ID with automatic fallback to local mockData
export async function fetchProjectById(id: string): Promise<Project | undefined> {
  try {
    const response = await apiClient.get<Project>(`/projects/${id}`);
    return response.data;
  } catch {
    return localProjectsCache.find((project) => project.id === id);
  }
}

// Submit a new winning project to the backend or append to local cache when offline
export async function submitProject(
  payload: ProjectCreatePayload
): Promise<{ project: Project; isOffline: boolean }> {
  try {
    const response = await apiClient.post<Project>("/projects", payload);
    return { project: response.data, isOffline: false };
  } catch {
    const fallbackProject: Project = {
      id: `proj-local-${Date.now()}`,
      hackathon_id: `hack-local-${Date.now()}`,
      project_name: payload.project_name,
      tagline: payload.tagline,
      track: payload.track,
      placement: payload.placement,
      problem_statement: payload.problem_statement,
      solution_summary: payload.solution_summary,
      key_differentiator: payload.key_differentiator,
      tech_stack: payload.tech_stack,
      repo_url: payload.repo_url || null,
      demo_url: payload.demo_url || null,
      pitch_deck_url: payload.pitch_deck_url || null,
      video_url: payload.video_url || null,
      verification_status: "unverified",
      proof_url: payload.proof_url || null,
      hackathon: {
        id: `hack-local-${Date.now()}`,
        name: payload.hackathon_name || "Community Submitted Hackathon",
        slug: "community-submitted-hackathon",
        organizer: payload.hackathon_organizer || "Community",
        year: payload.hackathon_year || 2026,
        region: payload.hackathon_region || "Global",
        website_url: payload.hackathon_website_url || null,
      },
    };
    localProjectsCache = [fallbackProject, ...localProjectsCache];
    return { project: fallbackProject, isOffline: true };
  }
}

