"use client";

export type Extras = {
  earring?: "none" | "star" | "hoop";
  hairclip?: "none" | "bow" | "clip";
};

export default function AvatarExtras({ extras }: { extras: Extras }) {
  const e = extras.earring ?? "none";
  const h = extras.hairclip ?? "none";

  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Brinco (aprox na orelha direita) */}
      {e !== "none" ? (
        <svg viewBox="0 0 264 280" className="absolute inset-0 h-full w-full">
          {e === "star" ? (
            <text x="205" y="150" fontSize="18">⭐</text>
          ) : (
            <circle cx="210" cy="146" r="6" fill="gold" stroke="rgba(0,0,0,0.25)" />
          )}
        </svg>
      ) : null}

      {/* Presilha/laço (aprox topo direito) */}
      {h !== "none" ? (
        <svg viewBox="0 0 264 280" className="absolute inset-0 h-full w-full">
          {h === "bow" ? (
            <text x="175" y="55" fontSize="20">🎀</text>
          ) : (
            <rect x="185" y="40" width="26" height="8" rx="6" fill="#ff6aa2" />
          )}
        </svg>
      ) : null}
    </div>
  );
}
