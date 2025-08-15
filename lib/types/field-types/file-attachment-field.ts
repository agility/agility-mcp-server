import { BaseField } from "./base-field";

export class FileAttachmentField extends BaseField {
	type = "FileAttachment";

	generateSettings(): Record<string, string> {
		return this.getBaseSettings();
	}
}
