// for AdonisJS v6
import path from "node:path";
import url from "node:url";
// ---

export default {
  // path: __dirname + "../", for AdonisJS v5
  path: path.dirname(url.fileURLToPath(import.meta.url)) + "../", // for AdonisJS v6
  title: "AdonisJs",
  version: "1.0.0",
  tagIndex: 2,
  ignore: ["/swagger", "/docs", "/v1"],
  preferredPutPatch: "PUT", // if PUT/PATCH are provided for the same route, prefer PUT
  common: {
    parameters: {}, // OpenAPI conform parameters that are commonly used
    headers: {}, // OpenAPI conform headers that are commonly used
  },
  persistAuthorization: true, // persist authorization between reloads on the swagger page
  snakeCase: true,
};
