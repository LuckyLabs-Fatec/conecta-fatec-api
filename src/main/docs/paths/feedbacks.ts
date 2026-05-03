export const feedbackPaths = {
  "/feedbacks": {
    get: {
      tags: ["Feedbacks"],
      summary: "Lista feedbacks",
      responses: {
        200: {
          description: "Lista de feedbacks",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PaginatedResponse" },
            },
          },
        },
      },
    },
    post: {
      tags: ["Feedbacks"],
      summary: "Cria feedback",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateFeedbackRequest" },
          },
        },
      },
      responses: {
        201: {
          description: "Feedback criado",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Feedback" },
            },
          },
        },
      },
    },
  },
} as const;
