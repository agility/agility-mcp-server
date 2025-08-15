import {
	LinkedContentDropdown,
	LinkedContentCheckboxes,
	LinkedContentSearchListBox,
	LinkedContentNestedGrid,
	LinkedContentNestedLink,
	LinkedContentSharedGrid,
	LinkedContentSharedLink,
	type SortDirection
} from "./index";

/**
 * Factory functions for creating specific LinkedContent field types
 */
export const createLinkedContent = {
	/**
	 * Create a LinkedContentDropdown field
	 */
	dropdown: (
		name: string,
		label: string,
		contentModel: string | number,
		textField: string,
		valueField: string,
		options?: {
			description?: string;
			contentView?: string;
			displayColumn?: string;
		}
	): LinkedContentDropdown => {
		const field = new LinkedContentDropdown(
			name,
			label,
			contentModel,
			textField,
			valueField,
			options?.description,
			options?.contentView
		);

		if (options?.displayColumn) {
			field.withDisplayColumn(options.displayColumn);
		}

		return field;
	},

	/**
	 * Create a LinkedContentCheckboxes field
	 */
	checkboxes: (
		name: string,
		label: string,
		contentModel: string | number,
		options?: {
			description?: string;
			contentView?: string;
		}
	): LinkedContentCheckboxes => {
		return new LinkedContentCheckboxes(
			name,
			label,
			contentModel,
			options?.description,
			options?.contentView
		);
	},

	/**
	 * Create a LinkedContentSearchListBox field
	 */
	searchListBox: (
		name: string,
		label: string,
		contentModel: string | number,
		options?: {
			description?: string;
			contentView?: string;
			defaultColumns?: string;
		}
	): LinkedContentSearchListBox => {
		const field = new LinkedContentSearchListBox(
			name,
			label,
			contentModel,
			options?.description,
			options?.contentView
		);

		if (options?.defaultColumns) {
			field.withDefaultColumns(options.defaultColumns);
		}

		return field;
	},

	/**
	 * Create a LinkedContentNestedGrid field
	 */
	nestedGrid: (
		name: string,
		label: string,
		contentModel: string | number,
		options?: {
			description?: string;
			sort?: string;
			sortDirection?: SortDirection;
			sortIDFieldName?: string;
			defaultColumns?: string;
		}
	): LinkedContentNestedGrid => {
		const field = new LinkedContentNestedGrid(
			name,
			label,
			contentModel,
			options?.description
		);

		if (options?.sort) {
			field.withSorting(
				options.sort,
				options.sortDirection,
				options.sortIDFieldName
			);
		}

		if (options?.defaultColumns) {
			field.withDefaultColumns(options.defaultColumns);
		}

		return field;
	},

	/**
	 * Create a LinkedContentNestedLink field
	 */
	nestedLink: (
		name: string,
		label: string,
		contentModel: string | number,
		options?: {
			description?: string;
		}
	): LinkedContentNestedLink => {
		return new LinkedContentNestedLink(
			name,
			label,
			contentModel,
			options?.description
		);
	},

	/**
	 * Create a LinkedContentSharedGrid field
	 */
	sharedGrid: (
		name: string,
		label: string,
		contentModel: string | number,
		options?: {
			description?: string;
			contentView?: string;
			sort?: string;
			sortDirection?: SortDirection;
			sortIDFieldName?: string;
			defaultColumns?: string;
		}
	): LinkedContentSharedGrid => {
		const field = new LinkedContentSharedGrid(
			name,
			label,
			contentModel,
			options?.description,
			options?.contentView
		);

		if (options?.sort) {
			field.withSorting(
				options.sort,
				options.sortDirection,
				options.sortIDFieldName
			);
		}

		if (options?.defaultColumns) {
			field.withDefaultColumns(options.defaultColumns);
		}

		return field;
	},

	/**
	 * Create a LinkedContentSharedLink field
	 */
	sharedLink: (
		name: string,
		label: string,
		contentModel: string | number,
		options?: {
			description?: string;
			contentView?: string;
		}
	): LinkedContentSharedLink => {
		return new LinkedContentSharedLink(
			name,
			label,
			contentModel,
			options?.description,
			options?.contentView
		);
	}
};

/**
 * Type-safe factory for creating LinkedContent fields based on render type
 */
export function createLinkedContentField(
	renderType: "dropdown",
	name: string,
	label: string,
	contentModel: string | number,
	textField: string,
	valueField: string,
	options?: Parameters<typeof createLinkedContent.dropdown>[5]
): LinkedContentDropdown;

export function createLinkedContentField(
	renderType: "checkboxes",
	name: string,
	label: string,
	contentModel: string | number,
	options?: Parameters<typeof createLinkedContent.checkboxes>[3]
): LinkedContentCheckboxes;

export function createLinkedContentField(
	renderType: "searchListBox",
	name: string,
	label: string,
	contentModel: string | number,
	options?: Parameters<typeof createLinkedContent.searchListBox>[3]
): LinkedContentSearchListBox;

export function createLinkedContentField(
	renderType: "nestedGrid",
	name: string,
	label: string,
	contentModel: string | number,
	options?: Parameters<typeof createLinkedContent.nestedGrid>[3]
): LinkedContentNestedGrid;

export function createLinkedContentField(
	renderType: "nestedLink",
	name: string,
	label: string,
	contentModel: string | number,
	options?: Parameters<typeof createLinkedContent.nestedLink>[3]
): LinkedContentNestedLink;

export function createLinkedContentField(
	renderType: "sharedGrid",
	name: string,
	label: string,
	contentModel: string | number,
	options?: Parameters<typeof createLinkedContent.sharedGrid>[3]
): LinkedContentSharedGrid;

export function createLinkedContentField(
	renderType: "sharedLink",
	name: string,
	label: string,
	contentModel: string | number,
	options?: Parameters<typeof createLinkedContent.sharedLink>[3]
): LinkedContentSharedLink;

export function createLinkedContentField(
	renderType: string,
	name: string,
	label: string,
	contentModel: string | number,
	...args: any[]
): any {
	switch (renderType) {
		case "dropdown":
			return createLinkedContent.dropdown(name, label, contentModel, args[0], args[1], args[2]);
		case "checkboxes":
			return createLinkedContent.checkboxes(name, label, contentModel, args[0]);
		case "searchListBox":
			return createLinkedContent.searchListBox(name, label, contentModel, args[0]);
		case "nestedGrid":
			return createLinkedContent.nestedGrid(name, label, contentModel, args[0]);
		case "nestedLink":
			return createLinkedContent.nestedLink(name, label, contentModel, args[0]);
		case "sharedGrid":
			return createLinkedContent.sharedGrid(name, label, contentModel, args[0]);
		case "sharedLink":
			return createLinkedContent.sharedLink(name, label, contentModel, args[0]);
		default:
			throw new Error(`Unknown LinkedContent render type: ${renderType}`);
	}
}
