// Represent hackathon event metadata returned by the API
export interface Hackathon {
  id: string;
  name: string;
  slug: string;
  organizer: string;
  year: number;
  region: string;
  website_url?: string | null;
}

// Represent verification states for indexed hackathon projects
export type VerificationStatus = "unverified" | "platform_verified" | "credential_verified";

// Represent a winning hackathon project record with competitive intelligence fields
export interface Project {
  id: string;
  hackathon_id: string;
  project_name: string;
  tagline: string;
  track: string;
  placement: string;
  problem_statement: string;
  solution_summary: string;
  key_differentiator: string;
  tech_stack: string[];
  repo_url?: string | null;
  demo_url?: string | null;
  pitch_deck_url?: string | null;
  video_url?: string | null;
  verification_status: VerificationStatus;
  proof_url?: string | null;
  hackathon?: Hackathon | null;
}

// Define active filter query parameters for searching the archive
export interface ProjectFilterParams {
  q?: string;
  track?: string;
  placement?: string;
  region?: string;
  tech_stack?: string;
}

// Define payload shape for submitting a new winning build to the archive
export interface ProjectCreatePayload {
  project_name: string;
  tagline: string;
  track: string;
  placement: string;
  problem_statement: string;
  solution_summary: string;
  key_differentiator: string;
  tech_stack: string[];
  repo_url?: string;
  demo_url?: string;
  pitch_deck_url?: string;
  video_url?: string;
  proof_url?: string;
  hackathon_name?: string;
  hackathon_organizer?: string;
  hackathon_year?: number;
  hackathon_region?: string;
  hackathon_website_url?: string;
}

