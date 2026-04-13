export function ContextPanel() {
  return (
    <aside className="fixed right-0 top-0 h-full w-80 bg-surface-container-low flex flex-col p-8 z-40 overflow-y-auto">
      {/* Upcoming Events */}
      <section className="mb-10">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 mb-6">
          Upcoming Events
        </h4>
        <div className="space-y-4">
          <EventCard month="Apr" day="14" title="Product Roadmap" time="11:00 AM — 12:30 PM" />
          <EventCard
            month="Apr"
            day="15"
            title="Design Critique"
            time="02:00 PM — 03:00 PM"
            dimmed
          />
        </div>
      </section>

      {/* Linked Documents */}
      <section className="mb-10">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 mb-6">
          Linked Documents
        </h4>
        <div className="space-y-3">
          <DocLink icon="description" name="Style_Guide_V2.pdf" />
          <DocLink icon="table_chart" name="Budget_Forecast_Q4.xlsx" />
          <DocLink icon="slideshow" name="Board_Pitch_Deck.pptx" />
        </div>
      </section>

      {/* AI Memory */}
      <section>
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 mb-6">
          Recent Context
        </h4>
        <div className="bg-surface-container-highest/30 rounded-2xl p-4">
          <p className="text-[10px] text-on-surface-variant/70 italic leading-relaxed">
            &ldquo;You were discussing the transition to the new Sanctuary
            system with Sarah yesterday at 4 PM.&rdquo;
          </p>
        </div>
      </section>
    </aside>
  );
}

function EventCard({
  month,
  day,
  title,
  time,
  dimmed,
}: {
  month: string;
  day: string;
  title: string;
  time: string;
  dimmed?: boolean;
}) {
  return (
    <div
      className={`bg-surface-container-highest/40 p-4 rounded-2xl flex gap-4 ${
        dimmed ? "opacity-60" : ""
      }`}
    >
      <div className="text-center bg-surface-container-highest p-2 rounded-xl h-fit min-w-[3.5rem]">
        <p className="text-[10px] font-bold uppercase text-on-surface-variant/60 leading-none mb-1">
          {month}
        </p>
        <p className="text-lg font-black leading-none">{day}</p>
      </div>
      <div>
        <p className="text-xs font-bold leading-tight mb-1">{title}</p>
        <p className="text-[10px] text-on-surface-variant/70">{time}</p>
      </div>
    </div>
  );
}

function DocLink({ icon, name }: { icon: string; name: string }) {
  return (
    <a
      href="#"
      className="flex items-center gap-3 p-3 hover:bg-surface-container-high rounded-xl transition-colors group"
    >
      <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary-container">
        {icon}
      </span>
      <span className="text-xs font-medium truncate">{name}</span>
    </a>
  );
}
