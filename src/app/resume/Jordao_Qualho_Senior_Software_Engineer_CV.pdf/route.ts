import { renderResumePdf } from "@/lib/resume-pdf";

// Generated at build time from src/data/profile.ts, so the CV always matches
// the site. The folder name is the public URL (profile.resumePath).
export const dynamic = "force-static";

export async function GET() {
  const pdf = await renderResumePdf();
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="Jordao_Qualho_Senior_Software_Engineer_CV.pdf"',
    },
  });
}
