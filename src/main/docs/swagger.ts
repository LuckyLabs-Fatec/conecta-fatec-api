const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "Conecta Fatec API",
    version: "1.0.0",
    description: "Documentação das rotas de autenticação da Conecta Fatec API.",
  },
  tags: [
    { name: "Auth", description: "Autenticação e cadastro de usuários" },
    { name: "Proposals", description: "Gerenciamento de propostas" },
    { name: "Courses", description: "Gerenciamento de cursos" },
    { name: "Projects", description: "Gerenciamento de projetos" },
    { name: "Feedbacks", description: "Gerenciamento de feedbacks" },
    { name: "Notifications", description: "Gerenciamento de notificações" },
    { name: "Project Students", description: "Gerenciamento de alunos em projetos" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Invalid credentials",
          },
        },
        required: ["message"],
      },
      LoginRequest: {
        type: "object",
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "usuario@email.com",
          },
          password: {
            type: "string",
            example: "senha-forte",
          },
        },
        required: ["email", "password"],
      },
      LoginResponse: {
        type: "object",
        properties: {
          accessToken: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
        },
        required: ["accessToken"],
      },
      RegisterRequest: {
        type: "object",
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "usuario@email.com",
          },
          password: {
            type: "string",
            example: "senha-forte",
          },
          name: {
            type: "string",
            example: "Usuário Exemplo",
          },
          avatar: {
            type: "string",
            format: "uri",
            nullable: true,
            example: "https://cdn.conecta-fatec.com/avatars/usuario-exemplo.png",
          },
          phone: {
            type: "string",
            maxLength: 15,
            example: "11999999999",
          },
          phoneIsWhats: {
            type: "boolean",
            default: false,
            example: true,
          },
        },
        required: ["email", "password", "phone"],
      },
      RegisterResponse: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            example: "7b9237cf-d8b9-40f2-9f42-c7eb4a40d54a",
          },
          email: {
            type: "string",
            format: "email",
            example: "usuario@email.com",
          },
          name: {
            type: "string",
            nullable: true,
            example: "Usuário Exemplo",
          },
          avatar: {
            type: "string",
            format: "uri",
            nullable: true,
            example: "https://cdn.conecta-fatec.com/avatars/usuario-exemplo.png",
          },
          phone: {
            type: "string",
            maxLength: 15,
            example: "11999999999",
          },
          phoneIsWhats: {
            type: "boolean",
            example: true,
          },
        },
        required: ["id", "email", "phone", "phoneIsWhats"],
      },
      CreateProposalRequest: {
        type: "object",
        properties: {
          title: {
            type: "string",
            example: "Mobilidade Inteligente no Campus",
          },
          description: {
            type: "string",
            example: "Uma proposta para otimizar o transporte interno e a acessibilidade no campus.",
          },
          submissionDate: {
            type: "string",
            format: "date-time",
            example: "2026-04-26T10:00:00.000Z",
          },
          status: {
            type: "string",
            example: "SUBMITTED",
          },
          attachments: {
            type: "string",
            format: "byte",
            example: "cGxhbm8tZGUtbW9iaWxpZGFkZS12MQ==",
          },
          optionalContactPhone: {
            type: "string",
            maxLength: 15,
            nullable: true,
            example: "11999999999",
          },
          optionalContactPhoneIsWhats: {
            type: "boolean",
            default: false,
            example: true,
          },
          optionalContactEmail: {
            type: "string",
            format: "email",
            maxLength: 100,
            nullable: true,
            example: "proposal-contact@example.com",
          },
        },
        required: ["title", "description", "submissionDate", "status", "attachments"],
      },
      CreateProposalResponse: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            example: "1f4d3c20-7f52-4c1f-b9ef-93cd5b8db001",
          },
          title: {
            type: "string",
            example: "Mobilidade Inteligente no Campus",
          },
          description: {
            type: "string",
            example: "Uma proposta para otimizar o transporte interno e a acessibilidade no campus.",
          },
          submissionDate: {
            type: "string",
            format: "date-time",
            example: "2026-04-26T10:00:00.000Z",
          },
          status: {
            type: "string",
            example: "SUBMITTED",
          },
          attachments: {
            type: "string",
            format: "byte",
            example: "cGxhbm8tZGUtbW9iaWxpZGFkZS12MQ==",
          },
          optionalContactPhone: {
            type: "string",
            maxLength: 15,
            nullable: true,
            example: "11999999999",
          },
          optionalContactPhoneIsWhats: {
            type: "boolean",
            example: true,
          },
          optionalContactEmail: {
            type: "string",
            format: "email",
            maxLength: 100,
            nullable: true,
            example: "proposal-contact@example.com",
          },
        },
        required: [
          "id",
          "title",
          "description",
          "submissionDate",
          "status",
          "attachments",
          "optionalContactPhoneIsWhats",
        ],
      },
      ProposalListItem: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            example: "1f4d3c20-7f52-4c1f-b9ef-93cd5b8db001",
          },
          title: {
            type: "string",
            example: "Mobilidade Inteligente no Campus",
          },
          description: {
            type: "string",
            example: "Uma proposta para otimizar o transporte interno e a acessibilidade no campus.",
          },
          submissionDate: {
            type: "string",
            format: "date-time",
            example: "2026-04-26T10:00:00.000Z",
          },
          status: {
            type: "string",
            example: "SUBMITTED",
          },
          attachments: {
            type: "string",
            format: "byte",
            example: "cGxhbm8tZGUtbW9iaWxpZGFkZS12MQ==",
          },
          optionalContactPhone: {
            type: "string",
            maxLength: 15,
            nullable: true,
            example: "11999999999",
          },
          optionalContactPhoneIsWhats: {
            type: "boolean",
            example: false,
          },
          optionalContactEmail: {
            type: "string",
            format: "email",
            maxLength: 100,
            nullable: true,
            example: "proposal-contact@example.com",
          },
        },
        required: [
          "id",
          "title",
          "description",
          "submissionDate",
          "status",
          "attachments",
          "optionalContactPhoneIsWhats",
        ],
      },
      ProposalListMeta: {
        type: "object",
        properties: {
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 10 },
          totalItems: { type: "integer", example: 42 },
          totalPages: { type: "integer", example: 5 },
        },
        required: ["page", "limit", "totalItems", "totalPages"],
      },
      ProposalListResponse: {
        type: "object",
        properties: {
          items: {
            type: "array",
            items: {
              $ref: "#/components/schemas/ProposalListItem",
            },
          },
          meta: {
            $ref: "#/components/schemas/ProposalListMeta",
          },
        },
        required: ["items", "meta"],
      },
      Course: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", example: "Systems Analysis" },
          description: { type: "string", nullable: true, example: "Technology projects" },
        },
        required: ["id", "name"],
      },
      CreateCourseRequest: {
        type: "object",
        properties: {
          name: { type: "string", example: "Systems Analysis" },
          description: { type: "string", example: "Technology projects" },
        },
        required: ["name"],
      },
      Project: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string", example: "Campus Mobility Platform" },
          description: { type: "string", example: "Build a prototype" },
          deadline: { type: "string", format: "date-time", nullable: true },
          status: { type: "string", example: "ACTIVE" },
          attachments: { type: "string", nullable: true, example: "brief" },
          courseId: { type: "string", format: "uuid" },
          proposalId: { type: "string", format: "uuid" },
          selectedFeedbackId: { type: "string", format: "uuid", nullable: true },
        },
        required: ["id", "title", "description", "status", "courseId", "proposalId"],
      },
      CreateProjectRequest: {
        type: "object",
        properties: {
          title: { type: "string", example: "Campus Mobility Platform" },
          description: { type: "string", example: "Build a prototype" },
          deadline: { type: "string", format: "date-time" },
          status: { type: "string", example: "ACTIVE" },
          attachments: { type: "string", example: "brief" },
          courseId: { type: "string", format: "uuid" },
          proposalId: { type: "string", format: "uuid" },
          selectedFeedbackId: { type: "string", format: "uuid" },
        },
        required: ["title", "description", "status", "courseId", "proposalId"],
      },
      Feedback: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          comment: { type: "string", nullable: true },
          attachments: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          userId: { type: "string", format: "uuid" },
          projectId: { type: "string", format: "uuid" },
        },
        required: ["id", "createdAt", "userId", "projectId"],
      },
      CreateFeedbackRequest: {
        type: "object",
        properties: {
          comment: { type: "string" },
          attachments: { type: "string" },
          userId: { type: "string", format: "uuid" },
          projectId: { type: "string", format: "uuid" },
        },
        required: ["userId", "projectId"],
      },
      Notification: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          message: { type: "string", example: "Your proposal was received." },
          createdAt: { type: "string", format: "date-time" },
          userId: { type: "string", format: "uuid" },
        },
        required: ["id", "message", "createdAt", "userId"],
      },
      CreateNotificationRequest: {
        type: "object",
        properties: {
          message: { type: "string", example: "Your proposal was received." },
          userId: { type: "string", format: "uuid" },
        },
        required: ["message", "userId"],
      },
      ProjectStudent: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          projectId: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
        },
        required: ["id", "projectId", "userId"],
      },
      CreateProjectStudentRequest: {
        type: "object",
        properties: {
          projectId: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
        },
        required: ["projectId", "userId"],
      },
      PaginatedResponse: {
        type: "object",
        properties: {
          items: { type: "array", items: { type: "object" } },
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 10 },
          totalItems: { type: "integer", example: 1 },
          totalPages: { type: "integer", example: 1 },
        },
        required: ["items", "page", "limit", "totalItems", "totalPages"],
      },
      RootResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Tempo Justo API is running!",
          },
        },
        required: ["message"],
      },
    },
  },
  paths: {
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Autentica usuário e retorna token JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login realizado com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LoginResponse",
                },
              },
            },
          },
          401: {
            description: "Credenciais inválidas",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          500: {
            description: "Erro interno",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Cria um novo usuário",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RegisterRequest",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Usuário criado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RegisterResponse",
                },
              },
            },
          },
          409: {
            description: "Usuário já existe",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          500: {
            description: "Erro interno",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/proposals": {
      get: {
        tags: ["Proposals"],
        summary: "Lista todas as propostas",
        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              example: 1,
            },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              example: 10,
            },
          },
        ],
        responses: {
          200: {
            description: "Lista de propostas",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProposalListResponse",
                },
              },
            },
          },
          400: {
            description: "Parâmetros de paginação inválidos",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          500: {
            description: "Erro interno",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Proposals"],
        summary: "Cria uma nova proposta",
        description: "Requer autenticação via JWT e perfil de comunidade (SOCIETY).",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateProposalRequest",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Proposta criada com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateProposalResponse",
                },
              },
            },
          },
          400: {
            description: "Payload inválido",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "Usuário não autenticado ou token inválido",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          403: {
            description: "Apenas usuários da comunidade podem postar propostas",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          500: {
            description: "Erro interno",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
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
  },
};

export { swaggerDocument };
