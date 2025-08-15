import { BaseField } from "./base-field";

export class ImageAttachmentField extends BaseField {
	type = "ImageAttachment";

	generateSettings(): Record<string, string> {
		return this.getBaseSettings();
	}
}
