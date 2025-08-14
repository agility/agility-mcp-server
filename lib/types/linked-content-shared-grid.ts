import { BaseField } from "./base-field";

export type SortDirection = "asc" | "desc";

export class LinkedContentSharedGrid extends BaseField {
	type = "Content";
	contentModel: string | number; // referenceName or ID of the Content model to link to
	contentView?: string; // referenceName of the content list, or '_newcontent_agility_' for new lists
	renderAs = "grid" as const;
	sort?: string;
	sortDirection?: SortDirection;
	sortIDFieldName?: string;
	defaultColumns?: string;
	isShared = true; // Indicates this is a shared content grid

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

	withContentView(contentView: string): LinkedContentSharedGrid {
		this.contentView = contentView;
		return this;
	}

	withSorting(
		sort: string = "ItemOrder",
		sortDirection: SortDirection = "asc",
		sortIDFieldName?: string
	): LinkedContentSharedGrid {
		this.sort = sort;
		this.sortDirection = sortDirection;
		this.sortIDFieldName = sortIDFieldName;
		return this;
	}

	withDefaultColumns(defaultColumns: string): LinkedContentSharedGrid {
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
