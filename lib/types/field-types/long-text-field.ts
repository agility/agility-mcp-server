import { TextBasedField } from "./text-based-field";

export class LongTextField extends TextBasedField {
	type = "LongText";

	generateSettings(): Record<string, string> {
		return this.getTextSettings();
	}
}
