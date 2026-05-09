import { MediatorConfigController } from "@/presentation/controllers/MediatorConfigController";

export function makeMediatorConfigController(): MediatorConfigController {
  return new MediatorConfigController();
}
