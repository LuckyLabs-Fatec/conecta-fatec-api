export const projectPaths = {
  "/projects": {
    get: {
      tags: ["Projects"],
      summary: "Lista projetos",
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
