import { json, onlyAllow, problem } from "@/lib/api";
import { caseSlugs, getCase } from "@/lib/profile-api";
export const { POST, PUT, PATCH, DELETE, OPTIONS } = onlyAllow("GET");
type Context = { params: Promise<{ slug: string }> };
export async function GET(_request: Request, { params }: Context) {
  const { slug } = await params;
  const found = getCase(slug);
  if (!found)
    return problem(
      "case_not_found",
      `No case study has the slug '${slug}'.`,
      `Use one of: ${caseSlugs.join(", ")}. GET /api/cases lists them.`,
    );
  return json(found);
}
