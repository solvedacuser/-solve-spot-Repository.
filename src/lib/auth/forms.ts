import { z } from "zod";
import { usernameSchema as leetCodeUsernameSchema } from "@/lib/leetcode/schemas";

export type AuthFieldErrors = Partial<
  Record<"email" | "password" | "displayName" | "leetcodeUsername" | "bojHandle", string>
>;

export type AuthActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: AuthFieldErrors;
};

export const initialAuthActionState: AuthActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

const emailSchema = z
  .string()
  .trim()
  .min(1, "이메일을 입력해주세요.")
  .email("올바른 이메일 주소를 입력해주세요.");

const passwordSchema = z
  .string()
  .min(8, "비밀번호는 8자 이상이어야 합니다.")
  .max(72, "비밀번호는 72자 이하여야 합니다.");

const displayNameSchema = z
  .string()
  .trim()
  .min(1, "이름을 입력해주세요.")
  .max(40, "이름은 40자 이하여야 합니다.");

const optionalBojHandleSchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  },
  z
    .string()
    .max(100, "BOJ handle 길이가 너무 깁니다.")
    .regex(/^[A-Za-z0-9_.-]+$/, "BOJ handle 형식이 올바르지 않습니다.")
    .optional(),
);

const optionalLeetCodeUsernameSchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  },
  leetCodeUsernameSchema.optional(),
);

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: displayNameSchema,
  leetcodeUsername: optionalLeetCodeUsernameSchema,
  bojHandle: optionalBojHandleSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

export const profileSchema = z.object({
  displayName: displayNameSchema,
  leetcodeUsername: optionalLeetCodeUsernameSchema,
  bojHandle: optionalBojHandleSchema,
});

export function getFieldErrors(error: z.ZodError): AuthFieldErrors {
  const flattened = error.flatten().fieldErrors;

  const fieldErrors: AuthFieldErrors = {
    email: flattened.email?.[0],
    password: flattened.password?.[0],
    displayName: flattened.displayName?.[0],
    bojHandle: flattened.bojHandle?.[0],
  };

  if (flattened.leetcodeUsername?.[0]) {
    fieldErrors.leetcodeUsername = flattened.leetcodeUsername[0];
  }

  return fieldErrors;
}

type AuthContext = "signup" | "login" | "profile";

type SupabaseErrorLike = {
  code?: string | null;
  message?: string | null;
};

export function getAuthErrorMessage(error: SupabaseErrorLike | null | undefined, context: AuthContext) {
  const message = error?.message?.toLowerCase() ?? "";

  if (context === "signup") {
    if (message.includes("already registered")) {
      return "이미 가입된 이메일입니다. 로그인하거나 메일함을 확인해주세요.";
    }

    return "회원가입을 완료하지 못했습니다. 입력값과 메일 설정을 다시 확인해주세요.";
  }

  if (context === "login") {
    if (message.includes("invalid login credentials")) {
      return "이메일 또는 비밀번호가 올바르지 않습니다.";
    }

    if (message.includes("email not confirmed")) {
      return "이메일 인증이 아직 완료되지 않았습니다. 메일함을 확인해주세요.";
    }

    return "로그인을 완료하지 못했습니다. 잠시 후 다시 시도해주세요.";
  }

  if (message.includes("profiles_leetcode_username_key") || message.includes("leetcode_username")) {
    return "This LeetCode username is already in use.";
  }

  if (error?.code === "23505" || message.includes("duplicate key")) {
    return "이미 사용 중인 BOJ handle입니다.";
  }

  return "프로필을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.";
}

export function getCallbackErrorMessage(error: string | null) {
  if (error === "confirm_failed") {
    return "이메일 인증을 완료하지 못했습니다. 다시 로그인하거나 메일 링크를 다시 열어주세요.";
  }

  return "";
}
