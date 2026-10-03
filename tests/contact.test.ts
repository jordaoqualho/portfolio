import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/contact/route";
import { ownerNotificationEmail } from "@/lib/contact-email";
import { resetRateLimit } from "@/lib/contact";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "Analytical Engines",
  message: "We are hiring a Senior Backend Engineer. Interested?",
  website: "",
  startedAt: Date.now() - 60_000,
};

const send = (body: unknown, headers: Record<string, string> = {}) =>
  POST(
    new Request("https://jordaoqualho.com/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://jordaoqualho.com",
        "x-forwarded-for": "203.0.113.7",
        ...headers,
      },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );

describe("contact API", () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    resetRateLimit();
    process.env.RESEND_API_KEY = "re_test";
    fetchMock = vi.fn(async () => new Response(JSON.stringify({ id: "1" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    delete process.env.RESEND_API_KEY;
  });

  it("sends through Resend with the visitor as reply-to", async () => {
    const response = await send(valid);
    expect(response.status).toBe(200);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    const payload = JSON.parse(init.body);
    expect(payload.reply_to).toBe("ada@example.com");
    expect(payload.to).toEqual(["jordaoqualho@gmail.com"]);
    expect(payload.subject).toContain("Ada Lovelace (Analytical Engines)");
  });

  it("rejects invalid fields with the field names", async () => {
    const response = await send({ ...valid, email: "nope", message: "hi" });
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "invalid_fields", fields: ["email", "message"] });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("quietly drops honeypot and too-fast submissions", async () => {
    expect((await send({ ...valid, website: "spam.example" })).status).toBe(200);
    expect((await send({ ...valid, startedAt: Date.now() })).status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("only accepts same-origin requests", async () => {
    expect((await send(valid, { origin: "https://evil.example" })).status).toBe(403);
  });

  it("rate limits a client after five messages", async () => {
    for (let i = 0; i < 5; i++) expect((await send(valid)).status).toBe(200);
    const limited = await send(valid);
    expect(limited.status).toBe(429);
    expect(limited.headers.get("retry-after")).toBeTruthy();
  });

  it("reports a send failure when Resend rejects or is not configured", async () => {
    fetchMock.mockResolvedValueOnce(new Response("bad", { status: 422 }));
    expect((await send(valid)).status).toBe(502);
    delete process.env.RESEND_API_KEY;
    expect((await send(valid)).status).toBe(502);
  });

  it("escapes visitor input in the HTML email", () => {
    const { html } = ownerNotificationEmail({ ...valid, message: "<script>alert(1)</script>" });
    expect(html).not.toContain("<script>");
  });

  it("also sends a branded confirmation to the visitor, reply-to the owner", async () => {
    const response = await send(valid);
    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [, confirmInit] = fetchMock.mock.calls[1];
    const payload = JSON.parse(confirmInit.body);
    expect(payload.to).toEqual(["ada@example.com"]);
    expect(payload.reply_to).toBe("jordaoqualho@gmail.com");
    expect(payload.html).toContain("Ada");
  });

  it("sends the visitor confirmation in the site's locale", async () => {
    await send(valid, { cookie: "locale=pt" });
    const [, confirmInit] = fetchMock.mock.calls[1];
    const payload = JSON.parse(confirmInit.body);
    expect(payload.subject).toContain("Mensagem recebida");
  });

  it("skips the visitor confirmation when the owner email fails", async () => {
    fetchMock.mockResolvedValueOnce(new Response("bad", { status: 422 }));
    await send(valid);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
