import axios from "axios";
import { Hackathon, Project, ProjectCreatePayload, ProjectFilterParams } from "./types";

// Connect to the hosted Render FastAPI backend (or override via VITE_API_URL)
const rawBaseUrl = (import.meta.env.VITE_API_URL || "https://podia.onrender.com/api/v1").replace(
  /\/+$/,
  ""
);
const API_BASE_URL = rawBaseUrl.endsWith("/api/v1") ? rawBaseUrl : `${rawBaseUrl}/api/v1`;

// Legacy seed IDs to exclude so demo projects never appear in the UI
const LEGACY_DEMO_IDS = new Set([
  "proj-checkmed-001",
  "proj-dataghost-002",
  "proj-agropulse-003",
]);

// Configure Axios client with production Render base URL and cold-start timeout
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch projects from the live FastAPI backend with query filters
export async function fetchProjects(params: ProjectFilterParams = {}): Promise<Project[]> {
  const cleanParams: Record<string, string> = {};
  if (params.q?.trim()) cleanParams.q = params.q.trim();
  if (params.track && params.track !== "All") cleanParams.track = params.track;
  if (params.placement && params.placement !== "All") cleanParams.placement = params.placement;
  if (params.region && params.region !== "All") cleanParams.region = params.region;
  if (params.tech_stack && params.tech_stack !== "All") cleanParams.tech_stack = params.tech_stack;

  const response = await apiClient.get<Project[]>("/projects", { params: cleanParams });
  return response.data.filter((project) => !LEGACY_DEMO_IDS.has(project.id));
}

// Fetch a single project by ID from the live FastAPI backend
export async function fetchProjectById(id: string): Promise<Project> {
  const response = await apiClient.get<Project>(`/projects/${id}`);
  return response.data;
}

// Submit a new winning project directly to the live FastAPI backend
export async function submitProject(payload: ProjectCreatePayload): Promise<Project> {
  const response = await apiClient.post<Project>("/projects", payload);
  return response.data;
}

// Fetch all indexed hackathons from the live FastAPI backend
export async function fetchHackathons(): Promise<Hackathon[]> {
  const response = await apiClient.get<Hackathon[]>("/hackathons");
  return response.data;
}
