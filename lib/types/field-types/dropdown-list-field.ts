import { TextBasedField } from "./text-based-field";
import { DropdownChoice } from "./shared-types";

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
