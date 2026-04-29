import { PrismaCourseRepository } from "@/infra/repositories/PrismaCourseRepository";
import { CourseController } from "@/presentation/controllers/CourseController";

export function makeCourseController(): CourseController {
  const courseRepository = new PrismaCourseRepository();

  return new CourseController(
    {
      execute: (data) => courseRepository.create(data),
    },
    {
      execute: (params) => courseRepository.findPaginated(params),
    },
  );
}
