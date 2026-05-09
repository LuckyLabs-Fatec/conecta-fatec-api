import { promises as fs } from "fs";
import { join } from "path";

export type MediatorConfig = {
  url: string;
};

const DATA_DIR = join(process.cwd(), "data");
const CONFIG_PATH = join(DATA_DIR, "mediator-config.json");

export class FileMediatorConfigRepository {
  async save(config: MediatorConfig): Promise<void> {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), "utf8");
  }

  async load(): Promise<MediatorConfig | null> {
    try {
      const content = await fs.readFile(CONFIG_PATH, "utf8");
      const parsed = JSON.parse(content) as MediatorConfig;
      if (!parsed?.url) return null;
      return parsed;
    } catch {
      return null;
    }
  }
}
