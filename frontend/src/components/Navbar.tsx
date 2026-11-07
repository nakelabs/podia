import React from "react";

interface NavbarProps {
  onOpenCommandPalette: () => void;
  onOpenSubmitModal: () => void;
}

// Render top navigation bar with podia.dev as the highlighted brand centerpiece
export const Navbar: React.FC<NavbarProps> = ({
  onOpenCommandPalette,
  onOpenSubmitModal,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-[#30363d] bg-[#0d1117]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        {/* Left: Highlighted podia.dev brand wordmark */}
        <a
          href="#top"
          className="group inline-flex items-center gap-1.5 focus:outline-none"
        >
          <span className="text-lg font-bold tracking-tight text-[#f0f6fc] sm:text-xl">
            podia
          </span>
          <span className="rounded bg-[#f0f6fc] px-1.5 py-0.5 font-mono text-xs font-bold tracking-tight text-[#0d1117] transition group-hover:bg-[#f0f6fc]/90">
            .dev
          </span>
        </a>

        {/* Center: Clean text search trigger with keyboard shortcut */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="flex flex-1 max-w-sm items-center justify-between gap-3 rounded-md border border-[#30363d] bg-[#161b22] px-3 py-1.5 text-left text-xs text-[#8b949e] transition hover:border-[#f0f6fc] hover:text-[#f0f6fc]"
        >
          <span className="truncate">Search archive...</span>
          <kbd className="rounded border border-[#30363d] bg-[#0d1117] px-1.5 py-0.5 font-mono text-[11px] text-[#8b949e]">
            ⌘K
          </kbd>
        </button>

        {/* Right: Minimal GitHub link and Submit action */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/podia-dev/podia"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-xs text-[#8b949e] transition hover:text-[#f0f6fc] sm:inline"
          >
            GitHub
          </a>

          <button
            type="button"
            onClick={onOpenSubmitModal}
            className="rounded-md border border-[#f0f6fc] bg-[#f0f6fc] px-3 py-1.5 text-xs font-medium text-[#0d1117] transition hover:bg-[#f0f6fc]/90"
          >
            Submit a Win
          </button>
        </div>
      </div>
    </header>
  );
};
