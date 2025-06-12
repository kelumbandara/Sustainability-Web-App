import { z } from "zod";
import axios from "axios";
import { userSchema } from "./userApi";
import { StorageFileSchema } from "../utils/StorageFiles.util";

export const ComponentSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
});

export type Component = z.infer<typeof ComponentSchema>;
