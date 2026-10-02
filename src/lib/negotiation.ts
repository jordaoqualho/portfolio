// True when an Accept header ranks text/markdown at least as high as text/html.
export function prefersMarkdown(accept: string) {
  let markdown = 0;
  let html = 0;
  for (const part of accept.toLowerCase().split(",")) {
    const [type, ...params] = part.split(";").map((s) => s.trim());
    const q = params.find((p) => p.startsWith("q="));
    const weight = q ? Number(q.slice(2)) || 0 : 1;
    if (type === "text/markdown") markdown = weight;
    else if (type === "text/html") html = weight;
  }
  return markdown > 0 && markdown >= html;
}
