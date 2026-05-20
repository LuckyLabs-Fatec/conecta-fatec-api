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
} as const;
