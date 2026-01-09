"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50"
      >
        Perfil ▾
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border bg-white shadow-lg">
          <Link className="block px-4 py-3 text-sm hover:bg-gray-50" href="/perfil" onClick={() => setOpen(false)}>
            Editar perfil
          </Link>
          <Link className="block px-4 py-3 text-sm hover:bg-gray-50" href="/medalhas" onClick={() => setOpen(false)}>
            Medalhas
          </Link>
          <Link className="block px-4 py-3 text-sm hover:bg-gray-50" href="/amigos" onClick={() => setOpen(false)}>
            Amigos
          </Link>
          <Link className="block px-4 py-3 text-sm hover:bg-gray-50" href="/pontuacao" onClick={() => setOpen(false)}>
            Pontuação
          </Link>
          <button
            onClick={logout}
            className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
