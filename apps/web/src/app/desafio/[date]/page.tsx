import { notFound } from "next/navigation";
import ChallengeClient from "./ChallengeClient";

function isValidISODate(s: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;

  if (!isValidISODate(date)) return notFound();

  return <ChallengeClient dateISO={date} />;
}
