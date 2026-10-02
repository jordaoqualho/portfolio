import { json, onlyAllow, problem } from "@/lib/api";
import { queryExperience } from "@/lib/profile-api";
export const { POST, PUT, PATCH, DELETE, OPTIONS } = onlyAllow("GET");
const allowed = ["technology", "company"];
export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const unknown = [...params.keys()].filter((key) => !allowed.includes(key));
  if (unknown.length)
    return problem(
      "invalid_request",
      `Unknown query parameter: ${unknown.join(", ")}.`,
      "Filter with ?technology=<name> and/or ?company=<name>, or pass neither for the full history.",
    );
  return json(
    queryExperience({
      technology: params.get("technology") || undefined,
      company: params.get("company") || undefined,
    }),
  );
}
