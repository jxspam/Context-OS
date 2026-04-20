"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/actions-types";

export async function createTask(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const rawTitle = formData.get("title");
  const title = typeof rawTitle === "string" ? rawTitle.trim() : "";
  if (!title) {
    return { error: "Title is required." };
  }

  const rawNotes = formData.get("notes");
  const notes =
    typeof rawNotes === "string" && rawNotes.trim().length > 0
      ? rawNotes.trim()
      : null;

  const rawDue = formData.get("due_date");
  const due_date =
    typeof rawDue === "string" && rawDue.length > 0 ? rawDue : null;

  const supabase = await createClient();
  if (!supabase) {
    return { error: "Supabase is not configured." };
  }

  const { error } = await supabase
    .from("tasks")
    .insert({ title, notes, due_date });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { error: null };
}
