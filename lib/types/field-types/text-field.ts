import { TextBasedField } from "./text-based-field";

export class TextField extends TextBasedField {
	type = "Text";

	generateSettings(): Record<string, string> {
		return this.getTextSettings();
	}
}
