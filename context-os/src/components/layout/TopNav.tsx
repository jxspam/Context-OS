"use client";

export function TopNav() {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 glass-panel flex items-center justify-between px-10 z-40 shadow-[0px_20px_40px_rgba(26,28,28,0.05)]">
      <div className="flex items-center gap-8">
        {/* Search */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant/40">
            search
          </span>
          <input
            type="text"
            placeholder="Search context..."
            className="bg-surface-container-high/50 border-none rounded-full pl-10 pr-4 py-1.5 text-sm focus:ring-2 focus:ring-primary-container/20 focus:outline-none w-64 transition-all"
          />
        </div>

        {/* Tabs */}
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#"
            className="text-sm font-semibold text-primary-container border-b-2 border-primary-container pb-0.5"
          >
            Focus
          </a>
          <a
            href="#"
            className="text-sm font-medium text-on-surface-variant/60 hover:opacity-80 transition-opacity"
          >
            Collaborate
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-on-surface-variant/60 hover:text-primary-container transition-colors">
          <span className="material-symbols-outlined">bolt</span>
        </button>
        <button className="p-2 text-on-surface-variant/60 hover:text-primary-container transition-colors relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface" />
        </button>
      </div>
    </header>
  );
}
