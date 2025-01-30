import { z } from "zod";

export const RemarkSchema = z.object({
    date: z.string(),
    content: z.string(),
})

export interface Remark {
    date: string;
    content: string;
}