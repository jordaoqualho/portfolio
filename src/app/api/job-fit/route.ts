import { z } from "zod";
import { json, onlyAllow, problem } from "@/lib/api";
import { evaluateJobFit } from "@/lib/profile-api";
export const { GET, PUT, PATCH, DELETE, OPTIONS } = onlyAllow("POST");
const hint =
  'Send a JSON body like {"job_description": "Senior Backend Engineer, Node.js, AWS…"} with Content-Type: application/json.';
const Body = z.object({ job_description: z.string().trim().min(1).max(20000) });
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return problem("invalid_request", "The request body is not valid JSON.", hint);
  }
  const parsed = Body.safeParse(body);
  if (!parsed.success)
    return problem(
      "invalid_request",
      "job_description must be a non-empty string of at most 20,000 characters.",
      hint,
    );
  return json(evaluateJobFit(parsed.data.job_description), {
    headers: { "Cache-Control": "no-store" },
  });
}
