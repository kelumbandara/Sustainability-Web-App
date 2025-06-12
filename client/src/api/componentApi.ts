import { z } from "zod";
import axios from "axios";
import { userSchema } from "./userApi";
import { StorageFileSchema } from "../utils/StorageFiles.util";

export const ComponentSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  date: z.date(),
});

export type Component = z.infer<typeof ComponentSchema>;

export const demoData = [
  {
    id: 1,
    name: "Demo A",
    created_at: null,
    updated_at: null
  },
  {
    id: 2,
    name: "Demo B",
    created_at: null,
    updated_at: null
  },
  {
    id: 3,
    name: "Demo C",
    created_at: null,
    updated_at: null
  },
  {
    id: 4,
    name: "Demo D",
    created_at: null,
    updated_at: null
  },
  {
    id: 5,
    name: "Demo E",
    created_at: null,
    updated_at: null
  },
  {
    id: 6,
    name: "Demo F",
    created_at: null,
    updated_at: null
  }
];
