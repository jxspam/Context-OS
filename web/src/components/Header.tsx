import { Search } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-surface/70 backdrop-blur-md flex items-center justify-between px-10 z-40">
      <div className="flex items-center gap-8">
        <div className="relative flex items-center">
          <Search
            className="absolute left-3 w-4 h-4 text-on-surface-variant/40"
            strokeWidth={1.5}
          />
          <input
            type="text"
            placeholder="Search context..."
            className="bg-surface-container-high/50 border-none rounded-full pl-10 pr-4 py-1.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
          />
        </div>
      </div>
    </header>
  );
}
