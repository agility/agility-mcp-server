import { BaseField } from "./base-field";

// Content field types and enums
export type ContentRenderAs = "dropdown" | "checkbox" | "searchlistbox" | "grid";
export type SortDirection = "asc" | "desc";

/**
 * @deprecated This generic ContentField class has been split into specific classes for better type safety:
 * - LinkedContentDropdown
 * - LinkedContentCheckboxes
 * - LinkedContentSearchListBox
 * - LinkedContentNestedGrid
 * - LinkedContentNestedLink
 * - LinkedContentSharedGrid
 * - LinkedContentSharedLink
 *
 * Use the specific classes instead of this generic one.
 */

export class ContentField extends BaseField {
	type = "Content";
	contentDefinition: string; // referenceName or ID of the Content model to link to
	contentView?: string; // referenceName of the content list, or '_newcontent_agility_' for new lists
	renderAs?: ContentRenderAs;
	linkedContentDropdownTextField?: string; // for RenderAs=dropdown
	linkedContentDropdownValueField?: string; // for RenderAs=dropdown
	displayColumnAttributeName?: string; // for RenderAs=dropdown
	sort?: string; // for RenderAs=grid
	sortDirection?: SortDirection; // for RenderAs=grid
	sortIDFieldName?: string; // for RenderAs=grid
	defaultColumns?: string; // for RenderAs=grid or searchlistbox

	constructor(
		name: string,
		label: string,
		contentDefinition: string,
		description?: string,
		required?: boolean,
		contentView?: string,
		renderAs?: ContentRenderAs
	) {
		super(name, label, description, required);
		this.contentDefinition = contentDefinition;
		this.contentView = contentView;
		this.renderAs = renderAs;
	}

	// Builder pattern methods for easier configuration
	withContentView(contentView: string): ContentField {
		this.contentView = contentView;
		return this;
	}

	withRenderAs(renderAs: ContentRenderAs): ContentField {
		this.renderAs = renderAs;
		return this;
	}

	withDropdownSettings(
		textField: string,
		valueField: string,
		displayColumn: string
	): ContentField {
		this.linkedContentDropdownTextField = textField;
		this.linkedContentDropdownValueField = valueField;
		this.displayColumnAttributeName = displayColumn;
		return this;
	}

	withGridSettings(
		sort: string = "ItemOrder",
		sortDirection: SortDirection = "asc",
		defaultColumns?: string,
		sortIDFieldName?: string
	): ContentField {
		this.sort = sort;
		this.sortDirection = sortDirection;
		this.defaultColumns = defaultColumns;
		this.sortIDFieldName = sortIDFieldName;
		return this;
	}

	generateSettings(): Record<string, string> {
		const settings = this.getBaseSettings();
		settings.ContentDefinition = this.contentDefinition;

		if (this.contentView) {
			settings.ContentView = this.contentView;
		}

		if (this.renderAs) {
			settings.RenderAs = this.renderAs;
		}

		if (this.linkedContentDropdownTextField) {
			settings.LinkedContentDropdownTextField = this.linkedContentDropdownTextField;
		}

		if (this.linkedContentDropdownValueField) {
			settings.LinkedContentDropdownValueField = this.linkedContentDropdownValueField;
		}

		if (this.displayColumnAttributeName) {
			settings.DisplayColumnAttributeName = this.displayColumnAttributeName;
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
