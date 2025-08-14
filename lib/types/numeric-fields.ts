import { BaseField } from "./base-field";

// Numeric field implementations

export class IntegerField extends BaseField {
	type = "Integer";
	defaultValue?: number;

	constructor(
		name: string,
		label: string,
		description?: string,
		required?: boolean,
		unique?: boolean,
		defaultValue?: number
	) {
		super(name, label, description, required, unique);
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

export class DecimalField extends BaseField {
	type = "Decimal";
	defaultValue?: number;

	constructor(
		name: string,
		label: string,
		description?: string,
		required?: boolean,
		unique?: boolean,
		defaultValue?: number
	) {
		super(name, label, description, required, unique);
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
