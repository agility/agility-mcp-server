import { BaseField } from "./base-field";

export class LinkedContentSharedLink extends BaseField {
	type = "Content";
	contentModel: string | number; // referenceName or ID of the Content model to link to
	contentView?: string; // referenceName of the content list, or '_newcontent_agility_' for new lists
	isShared = true; // Indicates this is a shared content link

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

	withContentView(contentView: string): LinkedContentSharedLink {
		this.contentView = contentView;
		return this;
	}

	generateSettings(): Record<string, string> {
		const settings = this.getBaseSettings();
		settings.ContentDefinition = this.contentModel.toString();

		if (this.contentView) {
			settings.ContentView = this.contentView;
		}

		return settings;
	}
}
