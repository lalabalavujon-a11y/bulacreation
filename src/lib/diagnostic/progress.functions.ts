import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ProgressSchema } from "../security/progress";
import { readProgress, writeProgress } from "../security/progress.server";
export const loadProgress = createServerFn({ method: "GET" }).handler(() => readProgress());
export const saveProgress = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      progress: ProgressSchema,
      version: z.number().int().min(0),
      privateMode: z.boolean(),
    }),
  )
  .handler(({ data }) => writeProgress(data.progress, data.version, data.privateMode));
