import Link from "next/link";
import { CalendarDays, CalendarPlus, Inbox, Plus, Settings } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low flex flex-col p-6 z-50">
      <div className="mb-10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary" />
        <div>
          <h1 className="text-xl font-bold tracking-tight text-primary leading-none">
            ContextOS
          </h1>
          <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-on-surface-variant/60 font-semibold leading-none">
            Kinetic Sanctuary
          </p>
        </div>
      </div>

      <button
        type="button"
        className="mb-8 w-full bg-gradient-to-br from-primary to-secondary text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm hover:opacity-95 transition-opacity"
      >
        <Plus className="w-4 h-4" />
        <span>New Context</span>
      </button>

      <nav className="space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-primary font-semibold bg-surface-container-high rounded-xl"
        >
          <CalendarDays className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-sm">Today</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors"
        >
          <CalendarPlus className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-sm">Upcoming</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors"
        >
          <Inbox className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-sm">All</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors"
        >
          <Settings className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-sm">Settings</span>
        </Link>
      </nav>

      <div className="mt-auto pt-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest" />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold truncate">You</p>
            <p className="text-xs text-on-surface-variant truncate">Workspace Solo</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
