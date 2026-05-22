export const projectStudentPaths = {
  "/project-students": {
    get: {
      tags: ["Project Students"],
      summary: "Lista alunos em projetos",
      description: "Requer autenticação via JWT e role mínima STUDENT.",
      security: [{ bearerAuth: [] }],
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
      description: "Requer autenticação via JWT e role mínima STUDENT.",
      security: [{ bearerAuth: [] }],
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
  "/project-students/{id}": {
    put: {
      tags: ["Project Students"],
      summary: "Atualiza vínculo aluno-projeto",
      description: "Requer autenticação via JWT e role mínima STUDENT.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "ID do vínculo a ser atualizado",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateProjectStudentRequest" },
          },
        },
      },
      responses: {
        200: {
          description: "Vínculo atualizado",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProjectStudent" },
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
          description: "Vínculo não encontrado",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
        },
        500: {
          description: "Erro interno",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
        },
      },
    },
    delete: {
      tags: ["Project Students"],
      summary: "Remove vínculo aluno-projeto",
      description: "Requer autenticação via JWT e role mínima STUDENT.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "ID do vínculo a ser removido",
        },
      ],
      responses: {
        204: { description: "Vínculo removido com sucesso" },
        401: {
          description: "Não autenticado",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
        },
        403: {
          description: "Sem role mínima STUDENT",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
        },
        404: {
          description: "Vínculo não encontrado",
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
