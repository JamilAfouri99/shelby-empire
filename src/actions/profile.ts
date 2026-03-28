"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { updateProfileSchema } from "@/lib/validators/schemas";
import { ok, err, type Result } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function updateProfile(
  formData: FormData
): Promise<Result<null, string>> {
  const parsed = updateProfileSchema.safeParse({
    username: formData.get("username") || undefined,
    display_name: formData.get("display_name") || undefined,
  });

  if (!parsed.success) {
    return err(parsed.error.errors[0].message);
  }

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err("Not authenticated");

  if (parsed.data.username) {
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", parsed.data.username)
      .neq("id", user.id)
      .maybeSingle();

    if (existing) return err("Username already taken");
  }

  const { error } = await supabase
    .from("profiles")
    .update(parsed.data)
    .eq("id", user.id);

  if (error) return err("Failed to update profile");

  revalidatePath("/profile");
  return ok(null);
}
