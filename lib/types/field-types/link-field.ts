import { BaseField } from "./base-field";

export class LinkField extends BaseField {
	type = "Link";

	generateSettings(): Record<string, string> {
		return this.getBaseSettings();
	}
}
