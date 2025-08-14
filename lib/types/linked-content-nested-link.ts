import { BaseField } from "./base-field";
import { NESTED_CONTENT_VIEW } from "./constants";

export class LinkedContentNestedLink extends BaseField {
	type = "Content";
	contentModel: string | number; // referenceName or ID of the Content model to link to

	constructor(
		name: string,
		label: string,
		contentModel: string | number,
		description?: string
	) {
		super(name, label, description, false);
		this.contentModel = contentModel;
	}

	generateSettings(): Record<string, string> {
		const settings = this.getBaseSettings();
		settings.ContentDefinition = this.contentModel.toString();
		settings.ContentView = NESTED_CONTENT_VIEW;

		return settings;
	}
}
