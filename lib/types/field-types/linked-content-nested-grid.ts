import { BaseField } from "./base-field";
import { NESTED_CONTENT_VIEW, DEFAULT_SORT_FIELD, DEFAULT_SORT_DIRECTION } from "../constants";

import { SortDirection } from "./shared-types";

export class LinkedContentNestedGrid extends BaseField {
	type = "Content";
	contentModel: string | number; // referenceName or ID of the Content model to link to
	renderAs = "grid" as const;
	sort?: string;
	sortDirection?: SortDirection;
	sortIDFieldName?: string;
	defaultColumns?: string;

	constructor(
		name: string,
		label: string,
		contentModel: string | number,
		description?: string
	) {
		super(name, label, description, false);
		this.contentModel = contentModel;
	}

	withSorting(
		sort: string = DEFAULT_SORT_FIELD,
		sortDirection: SortDirection = DEFAULT_SORT_DIRECTION,
		sortIDFieldName?: string
	): LinkedContentNestedGrid {
		this.sort = sort;
		this.sortDirection = sortDirection;
		this.sortIDFieldName = sortIDFieldName;
		return this;
	}

	withDefaultColumns(defaultColumns: string): LinkedContentNestedGrid {
		this.defaultColumns = defaultColumns;
		return this;
	}

	generateSettings(): Record<string, string> {
		const settings = this.getBaseSettings();
		settings.ContentDefinition = this.contentModel.toString();
		settings.RenderAs = this.renderAs;
		settings.ContentView = NESTED_CONTENT_VIEW;

		if (this.sort) {
			settings.Sort = this.sort;
		}

		if (this.sortDirection) {
			settings.SortDirection = this.sortDirection;
		}

		if (this.sortIDFieldName) {
			settings.SortIDFieldName = this.sortIDFieldName;
		}

		if (this.defaultColumns) {
			settings.DefaultColumns = this.defaultColumns;
		}

		return settings;
	}
}
