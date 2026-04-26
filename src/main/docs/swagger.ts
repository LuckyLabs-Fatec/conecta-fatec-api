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
  ],
  components: {
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
        },
        required: ["email", "password"],
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
        },
        required: ["id", "email"],
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
        },
        required: ["id", "title", "description", "submissionDate", "status", "attachments"],
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
      post: {
        tags: ["Proposals"],
        summary: "Cria uma nova proposta",
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
  },
};

export { swaggerDocument };
