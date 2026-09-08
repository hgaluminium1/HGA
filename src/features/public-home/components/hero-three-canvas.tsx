"use client";

/**
 * Optional Home hero brand moment behind `siteConfig.flags.heroThree`.
 * Full WebGL (Three.js) can replace this CSS canvas later; shipping a
 * lightweight metallic field keeps LCP healthy until explicitly enabled.
 */
export function HeroThreeCanvas() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(3,66,171,0.45),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(232,1,21,0.22),transparent_50%),linear-gradient(125deg,#00122f,#011d4c)]" />
      <div
        className="absolute inset-[-20%] animate-[spin_48s_linear_infinite] opacity-40"
        style={{
          background:
            "conic-gradient(from 90deg at 50% 50%, transparent 0deg, rgba(255,255,255,0.08) 60deg, transparent 120deg)",
        }}
      />
    </div>
  );
}
