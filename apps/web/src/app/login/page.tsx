"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ nickname, password }),
    });

    const json = await res.json();
    if (!json.ok) {
      setError(json.error || "Erro no login.");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const next = params.get("next") || "/";
    router.push(next);
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-extrabold">Entrar</h1>
      <p className="mt-1 text-sm text-gray-600">Entre com seu nickname e senha.</p>

      <form onSubmit={onSubmit} className="mt-5 space-y-3 rounded-3xl border bg-white p-5 shadow-sm">
        <div>
          <label className="text-sm font-semibold">Nickname</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Senha</label>
          <input
            type="password"
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error ? <p className="rounded-xl bg-red-50 p-2 text-sm text-red-700">{error}</p> : null}

        <button className="w-full rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white">
          Entrar
        </button>

        <p className="text-center text-sm text-gray-600">
          Não tem conta?{" "}
          <Link className="font-semibold text-blue-600" href="/cadastro">
            Criar conta
          </Link>
        </p>
      </form>
    </main>
  );
}
