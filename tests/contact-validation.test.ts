import { describe, expect, it } from "vitest";
import { fieldIssue, suggestEmail, validateAll } from "@/lib/contact-validation";

describe("contact field rules", () => {
  it.each([
    ["name", "", "required"],
    ["name", " A ", "short"],
    ["name", "Ada", null],
    ["email", "", "required"],
    ["email", "ada@", "format"],
    ["email", "ada@example.c", "format"],
    ["email", " ada@example.com ", null],
    ["company", "", null],
    ["company", "x".repeat(121), "long"],
    ["message", "", "required"],
    ["message", "too short", "short"],
    ["message", "A real message here.", null],
  ] as const)("%s %j → %s", (field, value, expected) => {
    expect(fieldIssue(field, value)).toBe(expected);
  });

  it("reports every failing field", () => {
    expect(validateAll({ name: "", email: "x", company: "", message: "hi" })).toEqual({
      name: "required",
      email: "format",
      message: "short",
    });
  });
});

describe("email typo suggestions", () => {
  it.each([
    ["ana@gmial.com", "ana@gmail.com"],
    ["ana@gmail.con", "ana@gmail.com"],
    ["Ana@Hotmial.com", "ana@hotmail.com"],
    ["ana@gmail.com", null],
    ["ana@acme-corp.io", null],
    ["ana", null],
  ])("%s → %s", (email, expected) => {
    expect(suggestEmail(email)).toBe(expected);
  });
});
