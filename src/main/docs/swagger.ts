import { swaggerPaths } from "./paths";

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
          user: {
            $ref: "#/components/schemas/PublicUser",
          },
        },
        required: ["accessToken", "user"],
      },
      PublicUser: {
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
          role: {
            type: "string",
            enum: ["SOCIETY", "MEDIATOR", "STUDENT"],
            example: "SOCIETY",
          },
        },
        required: ["id", "email", "phone", "phoneIsWhats", "role"],
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
      ProposalAuthor: {
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
          role: {
            type: "string",
            enum: ["SOCIETY", "MEDIATOR", "STUDENT"],
            example: "SOCIETY",
          },
        },
        required: ["id", "email", "role"],
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
          user: {
            $ref: "#/components/schemas/ProposalAuthor",
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
          "user",
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
          user: {
            $ref: "#/components/schemas/ProposalAuthor",
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
          "user",
        ],
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
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 10 },
          totalItems: { type: "integer", example: 42 },
          totalPages: { type: "integer", example: 5 },
        },
        required: ["items", "page", "limit", "totalItems", "totalPages"],
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
  paths: swaggerPaths,
};

export { swaggerDocument };
