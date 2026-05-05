export const proposalPaths = {
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
  "/proposals/mine": {
    get: {
      tags: ["Proposals"],
      summary: "Lista as propostas do usuário autenticado",
      security: [{ bearerAuth: [] }],
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
          description: "Lista de propostas do usuário autenticado",
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
          description: "Usuário autenticado sem permissão de comunidade",
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
  "/proposals/{id}": {
    put: {
      tags: ["Proposals"],
      summary: "Atualiza uma proposta existente",
      description: "Requer autenticação via JWT e perfil de comunidade (SOCIETY). Apenas o autor da proposta pode atualizá-la.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
          description: "ID da proposta a ser atualizada",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateProposalRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Proposta atualizada com sucesso",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateProposalResponse",
              },
            },
          },
        },
        400: {
          description: "Payload inválido ou ID de proposta ausente",
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
          description: "Apenas usuários da comunidade podem atualizar propostas",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Proposta não encontrada",
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
} as const;
