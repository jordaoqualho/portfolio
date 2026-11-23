import { resumePdfResponse } from "@/lib/resume-pdf";

// The Portuguese CV, generated at build time from src/data/profile.ts so it always
// matches the site. The folder name is the public URL (resumeFiles.pt).
export const dynamic = "force-static";

export function GET() {
  return resumePdfResponse("pt");
}
