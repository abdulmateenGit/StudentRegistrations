"use server";

import { createActionClient } from "../../utils/supabase/actions";
import { redirect } from "next/navigation";

function getEmailRedirectUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "http://localhost:3000"
  );
}

export async function login(formData) {
  const supabase = await createActionClient();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  redirect("/");
}

export async function signup(formData) {
  const supabase = await createActionClient();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const redirectUrl = getEmailRedirectUrl();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
    },
  });
  if (error) redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  redirect("/signup/success");
}

export async function logout() {
  const supabase = await createActionClient();
  await supabase.auth.signOut();
  redirect("/login");
}
