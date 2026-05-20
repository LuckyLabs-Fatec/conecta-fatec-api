export const projectPaths = {
  "/projects": {
    get: {
      tags: ["Projects"],
      summary: "Lista projetos",
      description: "Requer autenticação via JWT e role mínima STUDENT.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Lista de projetos",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PaginatedResponse" },
            },
          },
        },
      },
    },
    post: {
      tags: ["Projects"],
      summary: "Cria projeto",
      description: "Requer autenticação via JWT e role mínima MEDIATOR.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateProjectRequest" },
          },
        },
      },
      responses: {
        201: {
          description: "Projeto criado",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Project" },
            },
          },
        },
      },
    },
  },
} as const;
