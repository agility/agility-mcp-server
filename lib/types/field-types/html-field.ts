import { TextBasedField } from "./text-based-field";

export class HtmlField extends TextBasedField {
	type = "Html";

	generateSettings(): Record<string, string> {
		return this.getTextSettings();
	}
}
