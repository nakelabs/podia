import React from "react";

// Define full list of hackathon sectors (merged dynamically with project sectors)
export const TRACK_OPTIONS = [
  "All",
  "AI/ML",
  "Health",
  "Fintech",
  "Climate Tech",
  "Web3/Privacy",
  "DevTools",
  "Cybersecurity",
  "Hardware/IoT",
  "EdTech",
  "Robotics",
  "BioTech",
  "GovTech/Civic",
  "AR/VR & Gaming",
  "Consumer/Social",
  "SpaceTech",
  "Open Innovation",
];

// Define quick-filter pills for the most common hackathon tracks
const QUICK_TRACK_PILLS = [
  "All",
  "AI/ML",
  "Health",
  "Fintech",
  "Climate Tech",
  "Web3/Privacy",
];

// Define placement dropdown options
export const PLACEMENT_OPTIONS = [
  "All",
  "1st Place",
  "2nd Place",
  "3rd Place",
  "Grand Prize",
  "Track Winner",
  "Finalist",
];

// Define geographic region dropdown options
export const REGION_OPTIONS = [
  "All",
  "Global",
  "North America",
  "Europe",
  "Asia",
  "Africa",
  "Latin America",
  "Middle East",
  "Oceania",
];

interface FilterRibbonProps {
  selectedTrack: string;
  selectedPlacement: string;
  selectedRegion: string;
  selectedStack: string;
  availableTracks: string[];
  availableStacks: string[];
  onSelectTrack: (track: string) => void;
  onSelectPlacement: (placement: string) => void;
  onSelectRegion: (region: string) => void;
  onSelectStack: (stack: string) => void;
  onClearAll: () => void;
}

// Render single-row filter bar with quick-filter track pills on left and dropdown selectors on right
export const FilterRibbon: React.FC<FilterRibbonProps> = ({
  selectedTrack,
  selectedPlacement,
  selectedRegion,
  selectedStack,
  availableTracks,
  availableStacks,
  onSelectTrack,
  onSelectPlacement,
  onSelectRegion,
  onSelectStack,
  onClearAll,
}) => {
  const hasActiveFilters =
    selectedTrack !== "All" ||
    selectedPlacement !== "All" ||
    selectedRegion !== "All" ||
    selectedStack !== "All";

  return (
    <div className="sticky top-[53px] z-20 border-b border-[#30363d] bg-[#0d1117]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Horizontal quick-filter pills for common tracks */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {QUICK_TRACK_PILLS.map((track) => {
            const isActive = selectedTrack === track;
            return (
              <button
                key={track}
                type="button"
                onClick={() => onSelectTrack(track)}
                className={`whitespace-nowrap rounded-md border px-2.5 py-1 font-mono text-xs transition ${
                  isActive
                    ? "border-[#f0f6fc] bg-[#f0f6fc] font-medium text-[#0d1117]"
                    : "border-[#30363d] bg-[#161b22] text-[#8b949e] hover:border-[#8b949e] hover:text-[#f0f6fc]"
                }`}
              >
                {track}
              </button>
            );
          })}
        </div>

        {/* Right: More Sectors, Placement, Region, and Stack dropdown selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Filter by all sectors"
            value={selectedTrack}
            onChange={(e) => onSelectTrack(e.target.value)}
            className="h-8 cursor-pointer rounded-md border border-[#30363d] bg-[#161b22] px-2.5 font-mono text-xs text-[#8b949e] transition hover:border-[#8b949e] hover:text-[#f0f6fc] focus:border-[#f0f6fc] focus:text-[#f0f6fc] focus:outline-none"
          >
            {availableTracks.map((track) => (
              <option key={track} value={track} className="bg-[#161b22] text-[#f0f6fc]">
                {track === "All" ? `All Sectors (${availableTracks.length - 1})` : track}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by placement"
            value={selectedPlacement}
            onChange={(e) => onSelectPlacement(e.target.value)}
            className="h-8 cursor-pointer rounded-md border border-[#30363d] bg-[#161b22] px-2.5 font-mono text-xs text-[#8b949e] transition hover:border-[#8b949e] hover:text-[#f0f6fc] focus:border-[#f0f6fc] focus:text-[#f0f6fc] focus:outline-none"
          >
            {PLACEMENT_OPTIONS.map((placement) => (
              <option key={placement} value={placement} className="bg-[#161b22] text-[#f0f6fc]">
                {placement === "All" ? "Placement: All" : placement}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by region"
            value={selectedRegion}
            onChange={(e) => onSelectRegion(e.target.value)}
            className="h-8 cursor-pointer rounded-md border border-[#30363d] bg-[#161b22] px-2.5 font-mono text-xs text-[#8b949e] transition hover:border-[#8b949e] hover:text-[#f0f6fc] focus:border-[#f0f6fc] focus:text-[#f0f6fc] focus:outline-none"
          >
            {REGION_OPTIONS.map((region) => (
              <option key={region} value={region} className="bg-[#161b22] text-[#f0f6fc]">
                {region === "All" ? "Region: All" : region}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by tech stack"
            value={selectedStack}
            onChange={(e) => onSelectStack(e.target.value)}
            className="h-8 cursor-pointer rounded-md border border-[#30363d] bg-[#161b22] px-2.5 font-mono text-xs text-[#8b949e] transition hover:border-[#8b949e] hover:text-[#f0f6fc] focus:border-[#f0f6fc] focus:text-[#f0f6fc] focus:outline-none"
          >
            <option value="All" className="bg-[#161b22] text-[#f0f6fc]">
              Stack: All
            </option>
            {availableStacks.map((stack) => (
              <option key={stack} value={stack} className="bg-[#161b22] text-[#f0f6fc]">
                {stack}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearAll}
              className="h-8 rounded-md border border-[#f0f6fc] bg-[#161b22] px-2.5 font-mono text-xs text-[#f0f6fc] transition hover:bg-[#f0f6fc] hover:text-[#0d1117]"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
