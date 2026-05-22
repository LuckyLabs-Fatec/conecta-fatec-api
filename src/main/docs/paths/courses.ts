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
  "/courses/{id}": {
    put: {
      tags: ["Courses"],
      summary: "Atualiza curso",
      description: "Requer autenticação via JWT e role mínima MEDIATOR.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "ID do curso a ser atualizado",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateCourseRequest" },
          },
        },
      },
      responses: {
        200: {
          description: "Curso atualizado",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Course" },
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
          description: "Curso não encontrado",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
        },
        500: {
          description: "Erro interno",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
        },
      },
    },
    delete: {
      tags: ["Courses"],
      summary: "Remove curso",
      description: "Requer autenticação via JWT e role mínima MEDIATOR.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "ID do curso a ser removido",
        },
      ],
      responses: {
        204: { description: "Curso removido com sucesso" },
        401: {
          description: "Não autenticado",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
        },
        403: {
          description: "Sem role mínima MEDIATOR",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
        },
        404: {
          description: "Curso não encontrado",
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
