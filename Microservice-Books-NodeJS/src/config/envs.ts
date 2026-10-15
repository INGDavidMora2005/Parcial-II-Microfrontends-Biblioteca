import "dotenv/config";
import { EnvVar } from "env-var";

export const envs = {
  PORT: EnvVar.get("PORT").default("3001").asPortNumber(),
};
