export const projectStudentPaths = {
  "/project-students": {
    get: {
      tags: ["Project Students"],
      summary: "Lista alunos em projetos",
      responses: {
        200: {
          description: "Lista de alunos em projetos",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PaginatedResponse" },
            },
          },
        },
      },
    },
    post: {
      tags: ["Project Students"],
      summary: "Vincula aluno a projeto",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateProjectStudentRequest" },
          },
        },
      },
      responses: {
        201: {
          description: "Aluno vinculado ao projeto",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProjectStudent" },
            },
          },
        },
      },
    },
  },
} as const;
