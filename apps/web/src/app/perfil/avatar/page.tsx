"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadProfile, saveProfile, type Profile } from "@/lib/profileStore";
import DicebearAvatar from "@/components/DicebearAvatar";
import { useRouter } from "next/navigation";

type Tab = "gender" | "skin" | "hair" | "glasses" | "face" | "facial" | "clothes" | "extras" | "bg";

const skin = ["5b2d1f","7a3a2b","8a4b2d","a1603f","c0825d","f2d3b1"];
const hairColor = ["2c1b18","3a241b","4a2d21","b26a3b","d6a06a"];

const boyTop = ["shortFlat","shortRound","shortWaved","shortCurly","dreads","shaggy"];
const girlTop = ["bob","bun","curly","straight01","straight02","straightAndStrand","frida","longButNotTooLong","miaWallace","froBand"];

const glasses = ["kurt","prescription01","prescription02","round","sunglasses","wayfarers","eyepatch"];

const eyes = ["default","happy","side","squint","surprised","wink"];
const mouth = ["smile","twinkle","serious","eating","default"];

const facialHair = ["beardLight","beardMajestic","beardMedium","moustacheFancy","moustacheMagnum"];

const clothing = [
  "hoodie",
  "overall",
  "graphicShirt",
  "shirtCrewNeck",
  "shirtScoopNeck",
  "shirtVNeck",
  "blazerAndShirt",
  "blazerAndSweater",
  "collarAndSweater",
];

const clothesColor = ["65c9ff","a7ffc4","ffdbb4","ffafb9","c0aede","ffffff"];
const bg = ["e66767","4d9de0","7bc96f","f7b731","b389ff","ffffff"];

function randSeed() {
  return Math.random().toString(36).slice(2, 10);
}

export default function AvatarPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<Profile | null>(null);
  const [tab, setTab] = useState<Tab>("gender");

  useEffect(() => setDraft(loadProfile()), []);
  if (!draft) return null;

  const seed = draft.avatar.seed;
  const options = draft.avatar.options;
  const extras = draft.avatar.extras;

  function setOpt(part: Partial<Profile["avatar"]["options"]>) {
    setDraft({
      ...draft,
      photoDataUrl: undefined,
      avatar: { ...draft.avatar, options: { ...draft.avatar.options, ...part, style: ["circle"] } },
    });
  }

  function setExtras(part: Partial<Profile["avatar"]["extras"]>) {
    setDraft({ ...draft, avatar: { ...draft.avatar, extras: { ...draft.avatar.extras, ...part } } });
  }

  function setGender(g: "boy" | "girl") {
    setDraft({
      ...draft,
      gender: g,
      photoDataUrl: undefined,
      avatar: {
        ...draft.avatar,
        options: {
          ...draft.avatar.options,
          style: ["circle"],
          top: [g === "boy" ? "shortFlat" : "bob"],
          // barba começa desligada sempre; o usuário liga na aba "facial"
          facialHairProbability: 0,
          // presilha por padrão só pra menina (pode mudar depois)
        },
        extras: {
          ...draft.avatar.extras,
          hairclip: g === "girl" ? "bow" : "none",
        },
      },
    });
  }

  function save() {
    saveProfile(draft);
    router.push("/perfil");
  }

  const topOptions = draft.gender === "boy" ? boyTop : girlTop;

  return (
    <main className="min-h-screen bg-white">
      <header className="flex items-center justify-between border-b px-4 py-3">
        <Link href="/perfil" className="text-2xl font-bold text-gray-600">✕</Link>
        <h1 className="text-lg font-bold">Edite o seu avatar</h1>
        <button onClick={save} className="text-sm font-extrabold text-emerald-600">PRONTO</button>
      </header>

      <div className="h-[360px] w-full bg-gray-50 flex items-center justify-center">
        <div className="h-[320px] w-[320px] overflow-hidden rounded-3xl border bg-white">
          <DicebearAvatar seed={seed} options={options} extras={extras} className="h-full w-full" />
        </div>
      </div>

      <div className="border-t">
        <div className="flex flex-wrap gap-2 px-4 py-3">
          {[
            ["gender","👧🧒"],["skin","🧍"],["hair","💇"],["glasses","👓"],["face","🙂"],["facial","🧔"],["clothes","👕"],["extras","🎀"],["bg","🎨"]
          ].map(([k,label]) => (
            <button
              key={k}
              onClick={() => setTab(k as Tab)}
              className={[
                "rounded-xl border px-3 py-2 text-sm font-semibold",
                tab === k ? "bg-gray-900 text-white" : "bg-white hover:bg-gray-50",
              ].join(" ")}
            >
              {label}
            </button>
          ))}

          <button
            onClick={() => setDraft({ ...draft, avatar: { ...draft.avatar, seed: randSeed() } })}
            className="ml-auto rounded-xl border bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            Sortear rosto
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {tab === "gender" ? (
          <div className="space-y-3">
            <p className="text-sm font-bold">Menino ou menina</p>
            <div className="flex gap-2">
              <button onClick={() => setGender("boy")} className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50">Menino</button>
              <button onClick={() => setGender("girl")} className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50">Menina</button>
            </div>
          </div>
        ) : null}

        {tab === "skin" ? (
          <div>
            <p className="text-sm font-bold">Tom da pele</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {skin.map((c) => (
                <button key={c} onClick={() => setOpt({ skinColor: [c] })} className="h-12 w-12 rounded-2xl border" style={{ background: `#${c}` }} />
              ))}
            </div>
          </div>
        ) : null}

        {tab === "hair" ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-bold">Cabelo</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {topOptions.map((t) => (
                  <button key={t} onClick={() => setOpt({ top: [t], topProbability: 100 })} className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50">
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold">Cor do cabelo</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {hairColor.map((c) => (
                  <button key={c} onClick={() => setOpt({ hairColor: [c] })} className="h-12 w-12 rounded-2xl border" style={{ background: `#${c}` }} />
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {tab === "glasses" ? (
          <div>
            <p className="text-sm font-bold">Óculos</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => setOpt({ accessoriesProbability: 0 })} className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50">
                Sem óculos
              </button>
              {glasses.map((g) => (
                <button key={g} onClick={() => setOpt({ accessories: [g], accessoriesProbability: 100 })} className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50">
                  {g}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {tab === "face" ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-bold">Olhos</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {eyes.map((e) => (
                  <button key={e} onClick={() => setOpt({ eyes: [e] })} className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50">
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold">Boca</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {mouth.map((m) => (
                  <button key={m} onClick={() => setOpt({ mouth: [m] })} className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50">
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-600">
              Cor dos olhos: esse pack não expõe “eyeColor” (só tipo/formato). Se você quiser MUITO cor, a gente faz uma camada por cima depois.
            </p>
          </div>
        ) : null}

        {tab === "facial" ? (
          <div>
            <p className="text-sm font-bold">Barba / bigode</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => setOpt({ facialHairProbability: 0 })} className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50">
                Sem barba
              </button>
              {facialHair.map((f) => (
                <button key={f} onClick={() => setOpt({ facialHair: [f], facialHairProbability: 100 })} className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50">
                  {f}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {tab === "clothes" ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-bold">Roupa</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {clothing.map((c) => (
                  <button key={c} onClick={() => setOpt({ clothing: [c] })} className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50">
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold">Cor da roupa</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {clothesColor.map((c) => (
                  <button key={c} onClick={() => setOpt({ clothesColor: [c] })} className="h-12 w-12 rounded-2xl border" style={{ background: `#${c}` }} />
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {tab === "extras" ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-bold">Brinco</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["none","star","hoop"] as const).map((x) => (
                  <button key={x} onClick={() => setExtras({ earring: x })} className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50">
                    {x}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold">Presilha / laço</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["none","bow","clip"] as const).map((x) => (
                  <button key={x} onClick={() => setExtras({ hairclip: x })} className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50">
                    {x}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-600">
              Colar removido (porque estava feio mesmo). Depois a gente desenha um colar bonitinho em SVG se quiser.
            </p>
          </div>
        ) : null}

        {tab === "bg" ? (
          <div>
            <p className="text-sm font-bold">Fundo</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {bg.map((c) => (
                <button key={c} onClick={() => setOpt({ backgroundColor: [c] })} className="h-12 w-12 rounded-2xl border" style={{ background: `#${c}` }} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
