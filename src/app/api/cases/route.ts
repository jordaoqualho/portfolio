import { json, onlyAllow } from "@/lib/api";
import { listCases } from "@/lib/profile-api";
export const { POST, PUT, PATCH, DELETE, OPTIONS } = onlyAllow("GET");
export function GET() {
  return json(listCases());
}
