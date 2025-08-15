import { z } from "zod";

export const ImageAttachmentFieldSchema = z.object({
	type: z.literal("ImageAttachment"),
	name: z.string().min(2),
	label: z.string().min(2),
	description: z.string().optional(),
	required: z.boolean().optional()
});

export type ImageAttachmentField = z.infer<typeof ImageAttachmentFieldSchema>;
