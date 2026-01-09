"use client";

import { renderAvatarSvg, type AvatarOptions } from "@/lib/avatarDicebear";
import { useMemo } from "react";
import AvatarExtras, { type Extras } from "@/components/AvatarExtras";

export default function DicebearAvatar({
  seed,
  options,
  extras,
  className = "",
}: {
  seed: string;
  options?: AvatarOptions;
  extras?: Extras;
  className?: string;
}) {
  const svg = useMemo(() => renderAvatarSvg(seed, options), [seed, options]);

  return (
    <div className={"relative " + className}>
      <div dangerouslySetInnerHTML={{ __html: svg }} />
      {extras ? <AvatarExtras extras={extras} /> : null}
    </div>
  );
}
