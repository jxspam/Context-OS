"use client";

import { motion } from "framer-motion";

export function SuggestedTaskHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-12"
    >
      <div className="bg-gradient-to-br from-surface-container-high/50 to-surface-container/30 p-8 rounded-[32px] relative overflow-hidden group">
        {/* Ambient glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary-container/10 rounded-full blur-3xl group-hover:bg-primary-container/20 transition-colors duration-700 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined filled text-primary-container">
                auto_awesome
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-primary-container">
                Suggested Next Task
              </span>
            </div>

            <h3 className="text-2xl font-semibold mb-3">
              Refine typography scale for the Kinetic Sanctuary design system
            </h3>
            <p className="text-sm text-on-surface-variant/80 leading-relaxed mb-6">
              Based on your recent focus on the design spec, finalizing the
              H1-H6 scales will unblock the engineering team.
            </p>

            <div className="flex items-center gap-4">
              <button className="adaptive-gradient text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary-container/20">
                Start Focus Mode
              </button>
              <button className="text-on-surface-variant font-medium text-sm hover:underline underline-offset-4">
                Skip for later
              </button>
            </div>
          </div>

          {/* Decorative orb */}
          <div className="hidden lg:block w-48 h-48 relative">
            <div className="absolute inset-0 bg-primary-container/10 rounded-full blur-3xl group-hover:bg-primary-container/20 transition-colors duration-500" />
            <div className="absolute inset-4 adaptive-gradient rounded-2xl opacity-30 rotate-3 group-hover:rotate-0 transition-transform duration-500" />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
