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
} as const;
