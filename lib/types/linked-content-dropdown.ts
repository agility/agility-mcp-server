import { BaseField } from "./base-field";

export class LinkedContentDropdown extends BaseField {
	type = "Content";
	contentModel: string | number; // referenceName or ID of the Content model to link to
	contentView?: string; // referenceName of the content list, or '_newcontent_agility_' for new lists
	renderAs = "dropdown" as const;
	linkedContentDropdownTextField: string;
	linkedContentDropdownValueField: string;
	displayColumnAttributeName?: string;

	constructor(
		name: string,
		label: string,
		contentModel: string | number,
		textField: string,
		valueField: string,
		description?: string,
		contentView?: string
	) {
		super(name, label, description, false);
		this.contentModel = contentModel;
		this.linkedContentDropdownTextField = textField;
		this.linkedContentDropdownValueField = valueField;
		this.contentView = contentView;
	}

	withContentView(contentView: string): LinkedContentDropdown {
		this.contentView = contentView;
		return this;
	}

	withDisplayColumn(displayColumn: string): LinkedContentDropdown {
		this.displayColumnAttributeName = displayColumn;
		return this;
	}

	generateSettings(): Record<string, string> {
		const settings = this.getBaseSettings();
		settings.ContentDefinition = this.contentModel.toString();
		settings.RenderAs = this.renderAs;
		settings.LinkedContentDropdownTextField = this.linkedContentDropdownTextField;
		settings.LinkedContentDropdownValueField = this.linkedContentDropdownValueField;

		if (this.contentView) {
			settings.ContentView = this.contentView;
		}

		if (this.displayColumnAttributeName) {
			settings.DisplayColumnAttributeName = this.displayColumnAttributeName;
		}

		return settings;
	}
}
