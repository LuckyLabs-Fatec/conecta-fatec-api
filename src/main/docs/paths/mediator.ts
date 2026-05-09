export const mediatorPaths = {
  "/mediator/config": {
    post: {
      tags: ["Mediator"],
      summary: "Configure mediator API URL (admin only)",
      security: [{ adminApiKey: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                url: { type: "string", format: "uri", example: "https://mediador.example.com" },
              },
              required: ["url"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Mediator config saved",
          content: { "application/json": { schema: { type: "object", properties: { message: { type: "string" } } } } },
        },
        "400": {
          description: "Invalid payload",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
        },
        "401": { description: "Admin authentication required" },
        "403": { description: "Forbidden" },
        "500": {
          description: "Server error",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
        },
      },
    },
  },

  "/mediator/pre-approval": {
    post: {
      tags: ["Mediator"],
      summary: "Proxy pre-approval request to configured mediator API",
      requestBody: {
        required: true,
        content: { "application/json": { schema: { type: "object" } } },
      },
      responses: {
        "200": {
          description: "Mediator response forwarded",
          content: { "application/json": { schema: { type: "object" } } },
        },
        "400": { description: "Invalid request", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        "500": { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
      },
    },
  },
} as const;
