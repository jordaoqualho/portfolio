import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";
import { openApiSpec } from "@/lib/openapi";

export const origin = "https://example.test";
export const request = (path: string, init?: RequestInit) =>
  new Request(origin + path, init);
export const params = <T>(value: T) => ({ params: Promise.resolve(value) });

// Validates a response body against a schema from the published OpenAPI spec,
// so the tests fail when the API and its contract drift apart.
const spec = openApiSpec();
const ajv = new Ajv2020({ strict: false, allErrors: true });
addFormats(ajv);
ajv.addSchema({ $id: "spec", components: spec.components });
export function matchesSchema(name: string, body: unknown) {
  const validate = ajv.compile({ $ref: `spec#/components/schemas/${name}` });
  const valid = validate(body);
  return valid ? true : ajv.errorsText(validate.errors);
}
export function matchesSchemaObject(schema: object, body: unknown) {
  const resolved = JSON.parse(
    JSON.stringify(schema).replaceAll('"#/components', '"spec#/components'),
  );
  const validate = ajv.compile(resolved);
  return validate(body) ? true : ajv.errorsText(validate.errors);
}
