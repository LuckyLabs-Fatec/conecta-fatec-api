import { PrismaProjectRepository } from "@/infra/repositories/PrismaProjectRepository";
import { ProjectController } from "@/presentation/controllers/ProjectController";

export function makeProjectController(): ProjectController {
  const projectRepository = new PrismaProjectRepository();

  return new ProjectController(
    {
      execute: (data) => projectRepository.create(data),
    },
    {
      execute: (params) => projectRepository.findPaginated(params),
    },
  );
}
