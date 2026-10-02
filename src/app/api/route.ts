import { json, onlyAllow } from "@/lib/api";
import { apiIndex } from "@/lib/openapi";
export const { POST, PUT, PATCH, DELETE, OPTIONS } = onlyAllow("GET");
export function GET() {
  return json(apiIndex());
}
