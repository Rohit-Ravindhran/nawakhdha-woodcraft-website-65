
import { z } from "zod";
import { blogPostSchema } from "@/components/admin/PageSchemas";

export const blogSchema = blogPostSchema;

export type BlogFormValues = z.infer<typeof blogSchema>;
