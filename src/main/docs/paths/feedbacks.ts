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
      description: "Requer autenticação via JWT e role mínima STUDENT.",
      security: [{ bearerAuth: [] }],
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
  "/feedbacks/{id}": {
    put: {
      tags: ["Feedbacks"],
      summary: "Atualiza feedback",
      description: "Requer autenticação via JWT e role mínima STUDENT.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "ID do feedback a ser atualizado",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateFeedbackRequest" },
          },
        },
      },
      responses: {
        200: {
          description: "Feedback atualizado",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Feedback" },
            },
          },
        },
        401: {
          description: "Não autenticado",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
        },
        403: {
          description: "Sem role mínima STUDENT",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
        },
        404: {
          description: "Feedback não encontrado",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
        },
        500: {
          description: "Erro interno",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
        },
      },
    },
    delete: {
      tags: ["Feedbacks"],
      summary: "Remove feedback",
      description: "Requer autenticação via JWT e role mínima STUDENT.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "ID do feedback a ser removido",
        },
      ],
      responses: {
        204: { description: "Feedback removido com sucesso" },
        401: {
          description: "Não autenticado",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
        },
        403: {
          description: "Sem role mínima STUDENT",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
        },
        404: {
          description: "Feedback não encontrado",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
        },
        500: {
          description: "Erro interno",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
        },
      },
    },
  },
} as const;
