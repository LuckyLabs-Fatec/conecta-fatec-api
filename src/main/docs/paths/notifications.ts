export const notificationPaths = {
  "/notifications": {
    get: {
      tags: ["Notifications"],
      summary: "Lista notificações",
      responses: {
        200: {
          description: "Lista de notificações",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PaginatedResponse" },
            },
          },
        },
      },
    },
    post: {
      tags: ["Notifications"],
      summary: "Cria notificação",
      description: "Requer autenticação via JWT e role mínima MEDIATOR.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateNotificationRequest" },
          },
        },
      },
      responses: {
        201: {
          description: "Notificação criada",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Notification" },
            },
          },
        },
      },
    },
  },
  "/notifications/{id}": {
    put: {
      tags: ["Notifications"],
      summary: "Atualiza notificação",
      description: "Requer autenticação via JWT e role mínima MEDIATOR.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "ID da notificação a ser atualizada",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateNotificationRequest" },
          },
        },
      },
      responses: {
        200: {
          description: "Notificação atualizada",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Notification" },
            },
          },
        },
        401: {
          description: "Não autenticado",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
        },
        403: {
          description: "Sem role mínima MEDIATOR",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
        },
        404: {
          description: "Notificação não encontrada",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
        },
        500: {
          description: "Erro interno",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
        },
      },
    },
    delete: {
      tags: ["Notifications"],
      summary: "Remove notificação",
      description: "Requer autenticação via JWT e role mínima MEDIATOR.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "ID da notificação a ser removida",
        },
      ],
      responses: {
        204: { description: "Notificação removida com sucesso" },
        401: {
          description: "Não autenticado",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
        },
        403: {
          description: "Sem role mínima MEDIATOR",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
        },
        404: {
          description: "Notificação não encontrada",
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
