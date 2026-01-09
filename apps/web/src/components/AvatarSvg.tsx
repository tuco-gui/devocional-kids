export function AvatarSvg({
  skin = "#F3C7A6",
  hair = "short",
  glasses = "none",
  beard = "none",
  bg = "#E66767",
}: {
  skin?: string;
  hair?: string;
  glasses?: string;
  beard?: string;
  bg?: string;
}) {
  return (
    <svg viewBox="0 0 300 300" className="h-full w-full">
      <rect width="300" height="300" fill={bg} />
      {/* pescoço */}
      <rect x="130" y="190" width="40" height="35" rx="16" fill={skin} />
      {/* roupa */}
      <path d="M70 300c10-60 60-85 80-85h0c20 0 70 25 80 85H70z" fill="#3A3A3A" />
      {/* rosto */}
      <rect x="90" y="70" width="120" height="140" rx="55" fill={skin} />
      {/* orelhas */}
      <circle cx="85" cy="140" r="16" fill={skin} />
      <circle cx="215" cy="140" r="16" fill={skin} />

      {/* cabelo */}
      {hair !== "none" ? (
        hair === "short" ? (
          <path d="M92 110c0-35 30-55 58-55s58 20 58 55v10H92v-10z" fill="#4A2D21" />
        ) : hair === "curly" ? (
          <path d="M90 120c5-40 35-65 60-65s55 25 60 65c-10-10-25-10-30 0-10-10-25-10-30 0-10-10-25-10-30 0-10-10-25-10-30 0z" fill="#3A241B" />
        ) : (
          <path d="M92 115c10-45 40-60 58-60s48 15 58 60H92z" fill="#B26A3B" />
        )
      ) : null}

      {/* olhos */}
      <circle cx="130" cy="145" r="10" fill="#1F1F1F" />
      <circle cx="170" cy="145" r="10" fill="#1F1F1F" />
      <circle cx="127" cy="142" r="3" fill="#fff" />
      <circle cx="167" cy="142" r="3" fill="#fff" />

      {/* óculos */}
      {glasses !== "none" ? (
        <g stroke="#2B2B2B" strokeWidth="6" fill="none">
          <rect x="108" y="128" width="44" height="36" rx="12" />
          <rect x="148" y="128" width="44" height="36" rx="12" />
          <line x1="152" y1="146" x2="148" y2="146" />
        </g>
      ) : null}

      {/* boca */}
      <path d="M135 175c10 10 20 10 30 0" stroke="#C44B4B" strokeWidth="6" fill="none" strokeLinecap="round" />

      {/* barba */}
      {beard !== "none" ? (
        beard === "full" ? (
          <path d="M95 170c10 55 35 70 55 70s45-15 55-70c-20 20-35 25-55 25s-35-5-55-25z" fill="#3A241B" opacity="0.95" />
        ) : (
          <path d="M120 195c10 15 50 15 60 0" stroke="#3A241B" strokeWidth="10" strokeLinecap="round" />
        )
      ) : null}
    </svg>
  );
}
