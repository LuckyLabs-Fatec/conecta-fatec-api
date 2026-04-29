import { PrismaProjectStudentRepository } from "@/infra/repositories/PrismaProjectStudentRepository";
import { ProjectStudentController } from "@/presentation/controllers/ProjectStudentController";

export function makeProjectStudentController(): ProjectStudentController {
  const projectStudentRepository = new PrismaProjectStudentRepository();

  return new ProjectStudentController(
    {
      execute: (data) => projectStudentRepository.create(data),
    },
    {
      execute: (params) => projectStudentRepository.findPaginated(params),
    },
  );
}
