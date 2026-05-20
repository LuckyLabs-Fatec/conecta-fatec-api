export const coursePaths = {
  "/courses": {
    get: {
      tags: ["Courses"],
      summary: "Lista cursos",
      description: "Requer autenticação via JWT e role mínima STUDENT.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Lista de cursos",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PaginatedResponse" },
            },
          },
        },
      },
    },
    post: {
      tags: ["Courses"],
      summary: "Cria curso",
      description: "Requer autenticação via JWT e role mínima MEDIATOR.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateCourseRequest" },
          },
        },
      },
      responses: {
        201: {
          description: "Curso criado",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Course" },
            },
          },
        },
      },
    },
  },
} as const;
