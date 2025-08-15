import { BaseField } from "./base-field";

// Text-based fields that can have length and default value
export abstract class TextBasedField extends BaseField {
	defaultValue?: string;
	length?: number;
	copyAcrossAllLanguages?: boolean;

	constructor(
		name: string,
		label: string,
		description?: string,
		required?: boolean,
		unique?: boolean,
		defaultValue?: string,
		length?: number
	) {
		super(name, label, description, required, unique);
		this.defaultValue = defaultValue;
		this.length = length;
	}

	protected getTextSettings(): Record<string, string> {
		const settings = this.getBaseSettings();
		if (this.defaultValue !== undefined) {
			settings.DefaultValue = this.defaultValue;
		}
		if (this.length !== undefined) {
			settings.Length = this.length.toString();
		}

		if (this.copyAcrossAllLanguages !== undefined) {
			settings.CopyAcrossAllLanguages = this.copyAcrossAllLanguages.toString();
		}

		return settings;
	}
}
