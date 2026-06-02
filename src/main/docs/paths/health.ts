export const healthPaths = {
  "/health": {
    get: {
      tags: ["Health"],
      summary: "Verifica disponibilidade da API",
      description: "Endpoint público para health check. Retorna HTTP 200 quando a API está disponível.",
      responses: {
        200: {
          description: "API disponível",
        },
      },
    },
  },
} as const;
