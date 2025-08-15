// Base Field class that all specific field types extend
export abstract class Field {
	name: string;
	label: string;
	description?: string;
	abstract type: string;

	constructor(name: string, label: string, description?: string) {
		this.name = name;
		this.label = label;
		this.description = description;
	}

	// Abstract method that each field type must implement to generate their specific settings
	abstract generateSettings(): Record<string, string>;

	// Convert to the ModelField format expected by the Agility SDK
	toModelField(): {
		name: string;
		label: string;
		type: string;
		description?: string;
		settings: Record<string, string>;
	} {
		return {
			name: this.name,
			label: this.label,
			type: this.type,
			description: this.description,
			settings: this.generateSettings()
		};
	}
}

// Common base class for fields that can be required and have default values
export abstract class BaseField extends Field {
	required?: boolean;
	unique?: boolean;
	hideWhenFormula?: string;

	regexValidationPattern?: string;
	regexValidationMessage?: string;

	constructor(name: string, label: string, description?: string, required?: boolean, unique?: boolean) {
		super(name, label, description);
		this.required = required;
		this.unique = unique;
	}

	protected getBaseSettings(): Record<string, string> {
		const settings: Record<string, string> = {};
		if (this.required !== undefined) {
			settings.Required = this.required.toString();
		}
		if (this.unique !== undefined) {
			settings.Unique = this.unique.toString();
		}

		if (this.hideWhenFormula) {
			settings.HideWhenFormula = this.hideWhenFormula;
		}

		if (this.regexValidationPattern) {
			settings.RegexValidationPattern = this.regexValidationPattern;
		}
		if (this.regexValidationMessage) {
			settings.RegexValidationMessage = this.regexValidationMessage;
		}

		return settings;
	}
}

