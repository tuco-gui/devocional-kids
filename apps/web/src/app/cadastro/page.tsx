"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

function validateNickname(nick: string) {
  const n = (nick || "").trim();
  if (n.length < 3) return "Nickname precisa ter pelo menos 3 caracteres.";
  if (n.length > 20) return "Nickname muito longo (máx. 20).";
  if (!/^[a-zA-Z0-9_]+$/.test(n)) return "Use só letras, números e _ (sem espaço).";
  return null;
}

function validatePassword(pw: string) {
  if (!pw || pw.length < 8) return "A senha precisa ter pelo menos 8 caracteres.";
  const hasLetter = /[A-Za-z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  if (!hasLetter || !hasNumber) return "Use pelo menos 1 letra e 1 número.";
  return null;
}

async function safeReadJson(res: Response) {
  const text = await res.text();
  try {
    return { ok: true, json: JSON.parse(text) };
  } catch {
    return { ok: false, text };
  }
}

export default function CadastroPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const nickErr = useMemo(() => validateNickname(nickname), [nickname]);
  const pwErr = useMemo(() => validatePassword(password), [password]);
  const pw2Err = useMemo(() => (password2 && password !== password2 ? "As senhas não são iguais." : null), [password, password2]);

  const canSubmit = !nickErr && !pwErr && !pw2Err && nickname.trim() && password && password2;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // validação no client (para feedback imediato)
    const nErr = validateNickname(nickname);
    if (nErr) return setError(nErr);

    const pErr = validatePassword(password);
    if (pErr) return setError(pErr);

    if (password !== password2) return setError("As senhas não são iguais.");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ nickname, password }),
      });

      const parsed = await safeReadJson(res);

      if (!parsed.ok) {
        setError("Erro inesperado (resposta inválida do servidor).");
        return;
      }

      const json = parsed.json;

      if (!res.ok || !json.ok) {
        setError(json?.error || "Não foi possível criar a conta.");
        return;
      }

      // sucesso: volta para a home (middleware vai deixar)
      router.push("/");
    } catch (err: any) {
      setError("Falha de rede ou servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-extrabold">Criar conta</h1>
      <p className="mt-1 text-sm text-gray-600">
        Crie um nickname e uma senha para entrar.
      </p>

      <div className="mt-3 rounded-2xl border bg-amber-50 p-3 text-sm text-amber-900">
        <p className="font-semibold">Regras da senha</p>
        <ul className="mt-1 list-disc pl-5">
          <li>Mínimo de <b>8 caracteres</b></li>
          <li>Precisa ter <b>1 letra</b> e <b>1 número</b></li>
          <li>Não precisa de símbolo</li>
        </ul>
        <p className="mt-2 text-xs text-amber-800">
          Exemplo: <b>kids2026</b>
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-4 space-y-3 rounded-3xl border bg-white p-5 shadow-sm">
        <div>
          <label className="text-sm font-semibold">Nickname</label>
          <input
            className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400"
            placeholder="ex: enzo_2026"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
          />
          <p className="mt-1 text-xs text-gray-500">Use só letras, números e _ (sem espaço).</p>
          {nickErr ? <p className="mt-1 text-xs text-red-700">{nickErr}</p> : null}
        </div>

        <div>
          <label className="text-sm font-semibold">Senha</label>
          <input
            type="password"
            className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400"
            placeholder="mín. 8, com letra e número"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {pwErr ? <p className="mt-1 text-xs text-red-700">{pwErr}</p> : null}
        </div>

        <div>
          <label className="text-sm font-semibold">Confirmar senha</label>
          <input
            type="password"
            className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
          {pw2Err ? <p className="mt-1 text-xs text-red-700">{pw2Err}</p> : null}
        </div>

        {error ? <p className="rounded-xl bg-red-50 p-2 text-sm text-red-700">{error}</p> : null}

        <button
          disabled={!canSubmit || loading}
          className={[
            "w-full rounded-xl px-4 py-2 text-sm font-semibold text-white transition",
            loading ? "bg-gray-700" : "bg-gray-900 hover:bg-black",
            (!canSubmit || loading) ? "opacity-60" : "",
          ].join(" ")}
        >
          {loading ? "Criando..." : "Criar e entrar"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Já tem conta?{" "}
          <Link className="font-semibold text-blue-600" href="/login">
            Entrar
          </Link>
        </p>
      </form>
    </main>
  );
}
