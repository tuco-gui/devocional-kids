"use client";

import { useEffect, useMemo, useState } from "react";
import { loadDoneDates, saveDoneDates, toggleDone, isDone } from "@/lib/progress";
import {
  getAnswers,
  setAnswer,
  getActivityImage,
  setActivityImage,
  getAnswerImage,
  setAnswerImage,
} from "@/lib/journal";

function Modal({
  title,
  open,
  onClose,
  children,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-lg rounded-2xl bg-white p-4 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">{title}</h2>
          <button className="rounded-xl border px-3 py-1 text-sm font-semibold" onClick={onClose}>
            Fechar
          </button>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}

async function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function DevotionalActions({
  dateISO,
  questions,
}: {
  dateISO: string;
  questions: string[];
}) {
  const [doneDates, setDoneDates] = useState<string[]>([]);
  const done = isDone(dateISO, doneDates);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [activityImg, setActivityImg] = useState<string | null>(null);

  // modal estado
  const [openQ, setOpenQ] = useState<number | null>(null);
  const [mode, setMode] = useState<"text" | "image">("text");
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setDoneDates(loadDoneDates());
    setAnswers(getAnswers(dateISO));
    setActivityImg(getActivityImage(dateISO));
  }, [dateISO]);

  const answeredCount = useMemo(() => {
    let count = 0;
    for (let i = 0; i < questions.length; i++) {
      const hasText = (answers[i] ?? "").trim().length > 0;
      const hasImg = !!getAnswerImage(dateISO, i);
      if (hasText || hasImg) count += 1;
    }
    return count;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, questions.length, dateISO]);

  function onToggleDone() {
    const updated = toggleDone(dateISO, doneDates);
    setDoneDates(updated);
    saveDoneDates(updated);
  }

  function openAnswerText(i: number) {
    setMode("text");
    setDraft(answers[i] ?? "");
    setOpenQ(i);
  }

  function openAnswerImage(i: number) {
    setMode("image");
    setDraft("");
    setOpenQ(i);
  }

  function saveText() {
    if (openQ === null) return;
    setAnswers((prev) => ({ ...prev, [openQ]: draft }));
    setAnswer(dateISO, openQ, draft);
    setOpenQ(null);
  }

  async function pickAnswerImage(file: File | null) {
    if (!file || openQ === null) return;
    const dataUrl = await readFileAsDataURL(file);
    setAnswerImage(dateISO, openQ, dataUrl);
    setOpenQ(null);
  }

  async function pickActivityImage(file: File | null) {
    if (!file) return;
    const dataUrl = await readFileAsDataURL(file);
    setActivityImage(dateISO, dataUrl);
    setActivityImg(dataUrl);
  }

  return (
    <section className="mt-5 rounded-2xl border bg-white p-4 shadow-sm">
      {/* topo: status */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Seu devocional</p>
          <p className="mt-1 text-xs text-gray-600">
            Perguntas feitas: {answeredCount}/{questions.length}
          </p>
        </div>

        <button
          onClick={onToggleDone}
          className={[
            "rounded-xl px-3 py-2 text-sm font-semibold border transition active:scale-95",
            done ? "bg-emerald-500 text-white border-emerald-600" : "bg-white hover:bg-gray-50",
          ].join(" ")}
        >
          {done ? "Concluído ✓" : "Marcar como concluído"}
        </button>
      </div>

      {/* Vamos conversar */}
      <div className="mt-4 space-y-3">
        <h3 className="text-sm font-semibold">Vamos conversar?</h3>

        {questions.map((q, i) => {
          const img = getAnswerImage(dateISO, i);
          const hasText = (answers[i] ?? "").trim().length > 0;

          return (
            <div key={q} className="rounded-2xl border p-3">
              <p className="text-sm font-semibold">Pergunta {i + 1}</p>
              <p className="mt-1 text-sm text-gray-700">{q}</p>

              {/* status pequeno */}
              <p className="mt-2 text-xs text-gray-600">
                {hasText ? "✅ Respondida no app" : img ? "✅ Respondida por foto" : "⏳ Ainda não respondida"}
              </p>

              {/* botões de escolha */}
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50"
                  onClick={() => openAnswerText(i)}
                >
                  Responder aqui
                </button>

                <button
                  className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50"
                  onClick={() => openAnswerImage(i)}
                >
                  Anexar imagem
                </button>
              </div>

              {/* preview */}
              {hasText ? (
                <div className="mt-3 rounded-xl bg-gray-50 p-3 text-sm text-gray-800">
                  {answers[i]}
                </div>
              ) : null}

              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img} alt="Resposta anexada" className="mt-3 w-full rounded-2xl border bg-white" />
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Atividade: só anexar foto */}
      <div className="mt-5 rounded-2xl border bg-gray-50 p-3">
        <p className="text-sm font-semibold">📸 Anexar foto da atividade</p>
        <p className="mt-1 text-xs text-gray-600">
          Faça a atividade e envie a foto aqui.
        </p>

        <input
          className="mt-3 w-full"
          type="file"
          accept="image/*"
          onChange={(e) => pickActivityImage(e.target.files?.[0] ?? null)}
        />

        {activityImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={activityImg} alt="Atividade anexada" className="mt-3 w-full rounded-2xl border bg-white" />
        ) : null}
      </div>

      {/* Modal */}
      <Modal
        title={
          openQ === null
            ? "Resposta"
            : mode === "text"
            ? `Responder a pergunta ${openQ + 1}`
            : `Anexar imagem da pergunta ${openQ + 1}`
        }
        open={openQ !== null}
        onClose={() => setOpenQ(null)}
      >
        {openQ !== null && mode === "text" ? (
          <>
            <textarea
              className="h-40 w-full rounded-xl border p-3 text-sm"
              placeholder="Escreva aqui..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button
              onClick={saveText}
              className="mt-3 w-full rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Salvar
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-700">Escolha uma imagem.</p>
            <input
              className="mt-3 w-full"
              type="file"
              accept="image/*"
              onChange={(e) => pickAnswerImage(e.target.files?.[0] ?? null)}
            />
          </>
        )}
      </Modal>
    </section>
  );
}
