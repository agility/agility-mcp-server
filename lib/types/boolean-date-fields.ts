import { BaseField } from "./base-field";

// Boolean and Date field implementations

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

export class DateField extends BaseField {
	type = "Date";
	showTime?: boolean;

	constructor(
		name: string,
		label: string,
		description?: string,
		required?: boolean,
		showTime?: boolean
	) {
		super(name, label, description, required);
		this.showTime = showTime;
	}

	generateSettings(): Record<string, string> {
		const settings = this.getBaseSettings();
		if (this.showTime !== undefined) {
			settings.ShowTime = this.showTime.toString();
		}
		return settings;
	}
}
