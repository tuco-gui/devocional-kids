import { redirect } from "next/navigation";

function dateToISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function DesafioIndex() {
  const todayISO = dateToISO(new Date());
  redirect(`/desafio/${todayISO}`);
}
