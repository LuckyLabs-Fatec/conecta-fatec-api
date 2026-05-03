export const coursePaths = {
  "/courses": {
    get: {
      tags: ["Courses"],
      summary: "Lista cursos",
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
