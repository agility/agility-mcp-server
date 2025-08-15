import { BaseField } from "./base-field";

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
