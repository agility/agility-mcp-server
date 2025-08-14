
import { BaseField } from "./base-field";
import { TextBasedField } from "./text-fields";

// Dropdown choice interface
export interface DropdownChoice {
	label: string;
	value: string;
}

// Dropdown field implementation
export class DropdownListField extends TextBasedField {
	type = "DropdownList";
	choices: DropdownChoice[];

	constructor(
		name: string,
		label: string,
		choices: DropdownChoice[],
		description?: string,
		required?: boolean,
		defaultValue?: string
	) {
		super(name, label, description, required, undefined, defaultValue);
		this.choices = choices;
	}

	generateSettings(): Record<string, string> {
		const settings = this.getTextSettings();
		// Format choices as: Choice 1|value1\nChoice 2|value2\nChoice 3|value3
		const choicesString = this.choices
			.map(choice => `${choice.label}|${choice.value}`)
			.join('\n');
		settings.Choices = choicesString;
		return settings;
	}
}

// File attachment fields
export class FileAttachmentField extends BaseField {
	type = "FileAttachment";

	generateSettings(): Record<string, string> {
		return this.getBaseSettings();
	}
}

export class ImageAttachmentField extends BaseField {
	type = "ImageAttachment";

	generateSettings(): Record<string, string> {
		return this.getBaseSettings();
	}
}

export class LinkField extends BaseField {
	type = "Link";

	generateSettings(): Record<string, string> {
		return this.getBaseSettings();
	}
}
