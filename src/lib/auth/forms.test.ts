import {
  getAuthErrorMessage,
  getFieldErrors,
  loginSchema,
  profileSchema,
  signupSchema,
} from "@/lib/auth/forms";

describe("auth form schemas", () => {
  it("rejects invalid signup inputs", () => {
    const parsed = signupSchema.safeParse({
      email: "not-an-email",
      password: "short",
      displayName: " ",
      bojHandle: "bad handle!",
    });

    expect(parsed.success).toBe(false);
    expect(getFieldErrors(parsed.error)).toEqual({
      email: "올바른 이메일 주소를 입력해주세요.",
      password: "비밀번호는 8자 이상이어야 합니다.",
      displayName: "이름을 입력해주세요.",
      bojHandle: "BOJ handle 형식이 올바르지 않습니다.",
    });
  });

  it("normalizes optional boj handle to undefined", () => {
    const parsed = signupSchema.parse({
      email: "user@example.com",
      password: "password123",
      displayName: "Code Mate",
      bojHandle: "   ",
    });

    expect(parsed.bojHandle).toBeUndefined();
  });

  it("rejects invalid login input", () => {
    const parsed = loginSchema.safeParse({
      email: "",
      password: "",
    });

    expect(parsed.success).toBe(false);
    expect(getFieldErrors(parsed.error)).toEqual({
      email: "이메일을 입력해주세요.",
      password: "비밀번호를 입력해주세요.",
      displayName: undefined,
      bojHandle: undefined,
    });
  });

  it("rejects invalid profile handle", () => {
    const parsed = profileSchema.safeParse({
      displayName: "Code Mate",
      bojHandle: "wrong handle",
    });

    expect(parsed.success).toBe(false);
    expect(getFieldErrors(parsed.error).bojHandle).toBe("BOJ handle 형식이 올바르지 않습니다.");
  });
});

describe("auth error messages", () => {
  it("maps login credential errors", () => {
    expect(
      getAuthErrorMessage({ message: "Invalid login credentials" }, "login"),
    ).toBe("이메일 또는 비밀번호가 올바르지 않습니다.");
  });

  it("maps profile duplicate handle errors", () => {
    expect(
      getAuthErrorMessage({ code: "23505", message: "duplicate key value" }, "profile"),
    ).toBe("이미 사용 중인 BOJ handle입니다.");
  });
});
