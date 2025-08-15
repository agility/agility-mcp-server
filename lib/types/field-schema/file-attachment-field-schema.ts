import { z } from "zod";

export const FileAttachmentFieldSchema = z.object({
	type: z.literal("FileAttachment"),
	name: z.string().min(2),
	label: z.string().min(2),
	description: z.string().optional(),
	required: z.boolean().optional()
});

export type FileAttachmentField = z.infer<typeof FileAttachmentFieldSchema>;
