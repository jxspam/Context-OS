"use client";

import { usePathname } from "next/navigation";

const navItems = [
  { icon: "calendar_today", label: "Today", href: "/" },
  { icon: "event_upcoming", label: "Upcoming", href: "/upcoming" },
  { icon: "folder_open", label: "Projects", href: "/projects" },
  { icon: "insights", label: "Insights", href: "/insights" },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low flex flex-col p-6 z-50 overflow-y-auto">
      {/* Logo */}
      <div className="mb-10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg adaptive-gradient flex items-center justify-center text-white">
          <span className="material-symbols-outlined filled text-sm">
            blur_on
          </span>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tighter text-primary-container">
            ContextOS
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-semibold leading-none">
            Kinetic Sanctuary
          </p>
        </div>
      </div>

      {/* New Context CTA */}
      <button className="mb-8 w-full adaptive-gradient text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-lg shadow-primary-container/20 hover:opacity-90 transition-all active:scale-95">
        <span className="material-symbols-outlined text-sm">add</span>
        <span className="text-sm">New Context</span>
      </button>

      {/* Navigation */}
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "text-primary-container font-semibold bg-surface-container-high"
                  : "text-on-surface-variant/60 hover:bg-surface-container-high/50"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </a>
          );
        })}

        <a
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-on-surface-variant/60 hover:bg-surface-container-high/50"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="text-sm">Settings</span>
        </a>
      </nav>

      {/* User Profile */}
      <div className="pt-6 border-t border-outline-variant/10">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant font-bold text-sm">
            JV
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold truncate">Julian Vane</p>
            <p className="text-xs text-on-surface-variant truncate">
              Workspace Solo
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
