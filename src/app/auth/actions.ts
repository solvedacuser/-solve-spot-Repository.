"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getAuthErrorMessage,
  getFieldErrors,
  loginSchema,
  profileSchema,
  signupSchema,
  type AuthActionState,
} from "@/lib/auth/forms";
import { createClient } from "@/utils/supabase/server";

function getFormValue(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

async function getRequestOrigin() {
  const headerList = await headers();
  const protocol =
    headerList.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "development" ? "http" : "https");
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";

  return `${protocol}://${host}`;
}

function withError(fieldErrors: AuthActionState["fieldErrors"], message: string): AuthActionState {
  return {
    status: "error",
    message,
    fieldErrors,
  };
}

export async function signupAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = signupSchema.safeParse({
    email: getFormValue(formData, "email"),
    password: getFormValue(formData, "password"),
    displayName: getFormValue(formData, "displayName"),
    leetcodeUsername: getFormValue(formData, "leetcodeUsername"),
    bojHandle: getFormValue(formData, "bojHandle"),
  });

  if (!parsed.success) {
    return withError(getFieldErrors(parsed.error), "입력값을 확인해주세요.");
  }

  const supabase = await createClient();
  const redirectTo = `${await getRequestOrigin()}/auth/confirm`;
  const { email, password, displayName, leetcodeUsername, bojHandle } = parsed.data;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectTo,
      data: {
        display_name: displayName,
        ...(leetcodeUsername ? { leetcode_username: leetcodeUsername } : {}),
        ...(bojHandle ? { boj_handle: bojHandle } : {}),
      },
    },
  });

  if (error) {
    return withError({}, getAuthErrorMessage(error, "signup"));
  }

  if (!data.user) {
    return withError({}, "회원가입을 완료하지 못했습니다. 잠시 후 다시 시도해주세요.");
  }

  return {
    status: "success",
    message: `${email}로 인증 메일을 보냈습니다. 메일 링크를 열어 인증을 완료해주세요.`,
    fieldErrors: {},
  };
}

export async function loginAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: getFormValue(formData, "email"),
    password: getFormValue(formData, "password"),
  });

  if (!parsed.success) {
    return withError(getFieldErrors(parsed.error), "입력값을 확인해주세요.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return withError({}, getAuthErrorMessage(error, "login"));
  }

  revalidatePath("/");
  revalidatePath("/account");
  redirect("/");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/");
  revalidatePath("/account");
  redirect("/");
}

export async function updateProfileAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = profileSchema.safeParse({
    displayName: getFormValue(formData, "displayName"),
    leetcodeUsername: getFormValue(formData, "leetcodeUsername"),
    bojHandle: getFormValue(formData, "bojHandle"),
  });

  if (!parsed.success) {
    return withError(getFieldErrors(parsed.error), "입력값을 확인해주세요.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      display_name: parsed.data.displayName,
      ...(formData.has("leetcodeUsername") ? { leetcode_username: parsed.data.leetcodeUsername ?? null } : {}),
      boj_handle: parsed.data.bojHandle ?? null,
    },
    { onConflict: "id" },
  );

  if (error) {
    return withError({}, getAuthErrorMessage(error, "profile"));
  }

  revalidatePath("/");
  revalidatePath("/account");

  return {
    status: "success",
    message: "프로필을 저장했습니다.",
    fieldErrors: {},
  };
}
