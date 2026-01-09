import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

export async function getUserFromSession() {
  // Next 16: cookies() é async
  const store = await cookies();
  const token = store.get("dk_session")?.value;

  if (!token) return null;

  const nowIso = new Date().toISOString();

  const { data: session, error: sErr } = await supabaseAdmin
    .from("sessions")
    .select("token, user_id, expires_at")
    .eq("token", token)
    .gt("expires_at", nowIso)
    .maybeSingle();

  if (sErr || !session) return null;

  const { data: user, error: uErr } = await supabaseAdmin
    .from("users")
    .select("id, nickname, avatar_json")
    .eq("id", session.user_id)
    .maybeSingle();

  if (uErr || !user) return null;

  return user;
}
