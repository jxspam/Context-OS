import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Task } from "@/lib/types";
import { FocusView } from "@/components/FocusView";

export default async function FocusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) notFound();

  const { data } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const task = data as Task | null;
  if (!task) notFound();

  return <FocusView task={task} />;
}
