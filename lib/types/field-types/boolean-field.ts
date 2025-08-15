import { BaseField } from "./base-field";

export class BooleanField extends BaseField {
	type = "Boolean";
	defaultValue?: boolean;

	constructor(
		name: string,
		label: string,
		description?: string,
		required?: boolean,
		defaultValue?: boolean
	) {
		super(name, label, description, required);
		this.defaultValue = defaultValue;
	}

	generateSettings(): Record<string, string> {
		const settings = this.getBaseSettings();
		if (this.defaultValue !== undefined) {
			settings.DefaultValue = this.defaultValue.toString();
		}
		return settings;
	}
}
