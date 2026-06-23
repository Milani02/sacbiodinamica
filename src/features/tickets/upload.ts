import { createClient } from "@/lib/supabase/client";

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB

export interface UploadResult {
  ok: boolean;
  error?: string;
}

/**
 * Uploads a file to the private `attachments` bucket under the ticket's folder
 * and records its metadata. Runs in the browser with the user's session, so
 * RLS / Storage policies apply (the user must be able to access the ticket).
 */
export async function uploadAttachment(opts: {
  ticketId: string;
  file: File;
  fieldLabel?: string | null;
  messageId?: string | null;
}): Promise<UploadResult> {
  if (opts.file.size > MAX_BYTES) {
    return { ok: false, error: `${opts.file.name}: arquivo acima de 25 MB.` };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sessão expirada." };

  const ext = opts.file.name.includes(".")
    ? `.${opts.file.name.split(".").pop()}`
    : "";
  const path = `${opts.ticketId}/${crypto.randomUUID()}${ext}`;

  const up = await supabase.storage
    .from("attachments")
    .upload(path, opts.file, { upsert: false });
  if (up.error) return { ok: false, error: up.error.message };

  const ins = await supabase.from("ticket_attachments").insert({
    ticket_id: opts.ticketId,
    message_id: opts.messageId ?? null,
    uploaded_by: user.id,
    field_label: opts.fieldLabel ?? null,
    file_path: path,
    file_name: opts.file.name,
    mime_type: opts.file.type || null,
    size_bytes: opts.file.size,
  });
  if (ins.error) return { ok: false, error: ins.error.message };

  return { ok: true };
}
