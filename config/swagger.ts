// for AdonisJS v6
import path from "node:path";
import url from "node:url";
// ---

export default {
  // path: __dirname + "../", for AdonisJS v5
  path: path.dirname(url.fileURLToPath(import.meta.url)) + "", // for AdonisJS v6
  title: "AdonisJs",
  version: "1.0.0",
  tagIndex: 2,
  ignore: ["/v1/swagger", "/v1/docs", "/v1", "/"],
  preferredPutPatch: "PUT", // if PUT/PATCH are provided for the same route, prefer PUT
  common: {
    parameters: {
      sortable: [
        {
          in: "query",
          name: "sortBy",
          schema: { type: "string", example: "foo" },
        },
        {
          in: "query",
          name: "sortType",
          schema: { type: "string", example: "ASC" },
        },
      ],
    },
    headers: {
      paginated: {
        "X-Total-Pages": {
          description: "Total amount of pages",
          schema: { type: "integer", example: 5 },
        },
        "X-Total": {
          description: "Total amount of results",
          schema: { type: "integer", example: 100 },
        },
        "X-Per-Page": {
          description: "Results per page",
          schema: { type: "integer", example: 20 },
        },
      },
    },
  },
  persistAuthorization: true, // persist authorization between reloads on the swagger page
  snakeCase: true,
};
