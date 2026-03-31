"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { signupSchema, loginSchema } from "@/lib/validators/schemas";
import { redirect } from "next/navigation";
import { err, type Result } from "@/lib/utils";

type AuthError = { message: string; field?: string };

export async function signup(
  formData: FormData
): Promise<Result<null, AuthError>> {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    username: formData.get("username"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.errors[0];
    return err({ message: firstError.message, field: firstError.path[0]?.toString() });
  }

  const { email, password, username } = parsed.data;
  const supabase = await createServerSupabaseClient();

  const { data: existingUser } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (existingUser) {
    return err({ message: "Username already taken", field: "username" });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  });

  if (error) {
    return err({ message: error.message });
  }

  if (data.user) {
    // The user_streaks row is auto-created by a database trigger on profile insertion.
    await supabase.from("profiles").upsert({
      id: data.user.id,
      username,
      display_name: username,
    });
  }

  redirect("/today");
}

export async function login(
  formData: FormData
): Promise<Result<null, AuthError>> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.errors[0];
    return err({ message: firstError.message, field: firstError.path[0]?.toString() });
  }

  const { email, password } = parsed.data;
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return err({ message: "Invalid email or password" });
  }

  redirect("/today");
}

export async function logout(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
}
