import { BaseField } from "./base-field";

export class LinkedContentSearchListBox extends BaseField {
	type = "Content";
	contentModel: string | number; // referenceName or ID of the Content model to link to
	contentView?: string; // referenceName of the content list, or '_newcontent_agility_' for new lists
	renderAs = "searchlistbox" as const;
	defaultColumns?: string;

	constructor(
		name: string,
		label: string,
		contentModel: string | number,
		description?: string,
		contentView?: string
	) {
		super(name, label, description, false);
		this.contentModel = contentModel;
		this.contentView = contentView;
	}

	withContentView(contentView: string): LinkedContentSearchListBox {
		this.contentView = contentView;
		return this;
	}

	withDefaultColumns(defaultColumns: string): LinkedContentSearchListBox {
		this.defaultColumns = defaultColumns;
		return this;
	}

	generateSettings(): Record<string, string> {
		const settings = this.getBaseSettings();
		settings.ContentDefinition = this.contentModel.toString();
		settings.RenderAs = this.renderAs;

		if (this.contentView) {
			settings.ContentView = this.contentView;
		}

		if (this.defaultColumns) {
			settings.DefaultColumns = this.defaultColumns;
		}

		return settings;
	}
}
