// Shared types for field types
export type ContentRenderAs = "dropdown" | "checkbox" | "searchlistbox" | "grid";
export type SortDirection = "asc" | "desc";

// Dropdown choice interface
export interface DropdownChoice {
	label: string;
	value: string;
}
