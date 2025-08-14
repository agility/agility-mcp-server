import {
	LinkedContentDropdown,
	LinkedContentCheckboxes,
	LinkedContentSearchListBox,
	LinkedContentNestedGrid,
	LinkedContentNestedLink,
	LinkedContentSharedGrid,
	LinkedContentSharedLink,
	createLinkedContent,
	createLinkedContentField
} from "../types";

/**
 * Examples of using the specific LinkedContent field classes
 */

// Example 1: LinkedContentDropdown - for selecting a single author
const authorDropdown = new LinkedContentDropdown(
	"author",
	"Article Author",
	"author", // content definition
	"name", // text field
	"contentID", // value field
	"Select the author for this article",
	"_newcontent_agility_"
)
	.withDisplayColumn("name");

// Example 2: LinkedContentCheckboxes - for selecting multiple categories
const categoriesCheckboxes = new LinkedContentCheckboxes(
	"categories",
	"Article Categories",
	"category",
	"Select one or more categories",
	"_newcontent_agility_"
);

// Example 3: LinkedContentSearchListBox - for searching and selecting products
const productsSearchListBox = new LinkedContentSearchListBox(
	"relatedProducts",
	"Related Products",
	"product",
	"Search and select related products"
)
	.withDefaultColumns("name,price,category");

// Example 4: LinkedContentNestedGrid - for managing nested content items
const nestedItemsGrid = new LinkedContentNestedGrid(
	"childItems",
	"Child Items",
	"childitem",
	"Manage nested content items"
)
	.withSorting("title", "asc", "itemOrder")
	.withDefaultColumns("title,status,lastModified");

// Example 5: LinkedContentNestedLink - for simple nested content linking
const nestedLink = new LinkedContentNestedLink(
	"parentItem",
	"Parent Item",
	"parentitem",
	"Link to parent content item"
);

// Example 6: LinkedContentSharedGrid - for shared content management
const sharedContentGrid = new LinkedContentSharedGrid(
	"sharedResources",
	"Shared Resources",
	"resource",
	"Manage shared resources across multiple pages"
)
	.withSorting("name", "asc")
	.withDefaultColumns("name,type,lastUpdated");

// Example 7: LinkedContentSharedLink - for simple shared content linking
const sharedLink = new LinkedContentSharedLink(
	"globalFooter",
	"Global Footer",
	"footer",
	"Link to shared footer content"
);

/**
 * Examples using the factory functions
 */

// Using createLinkedContent factory
const authorDropdownFactory = createLinkedContent.dropdown(
	"author",
	"Author",
	"author",
	"name",
	"contentID",
	{
		description: "Select article author",
		contentView: "_newcontent_agility_",
		displayColumn: "name"
	}
);

const categoriesCheckboxesFactory = createLinkedContent.checkboxes(
	"categories",
	"Categories",
	"category",
	{
		description: "Select categories",
		contentView: "_newcontent_agility_"
	}
);

const nestedGridFactory = createLinkedContent.nestedGrid(
	"childItems",
	"Child Items",
	"childitem",
	{
		description: "Manage child items",
		sort: "title",
		sortDirection: "asc",
		defaultColumns: "title,status"
	}
);

// Using the type-safe createLinkedContentField function
const typeSafeDropdown = createLinkedContentField(
	"dropdown",
	"author",
	"Author",
	"author",
	"name",
	"contentID",
	{
		description: "Select author"
	}
);

const typeSafeCheckboxes = createLinkedContentField(
	"checkboxes",
	"tags",
	"Tags",
	"tag",
	{
		description: "Select tags"
	}
);

const typeSafeNestedGrid = createLinkedContentField(
	"nestedGrid",
	"items",
	"Items",
	"item",
	{
		description: "Manage items",
		sort: "order",
		sortDirection: "asc"
	}
);

/**
 * Export examples for documentation
 */
export const linkedContentExamples = {
	directInstantiation: {
		authorDropdown,
		categoriesCheckboxes,
		productsSearchListBox,
		nestedItemsGrid,
		nestedLink,
		sharedContentGrid,
		sharedLink
	},
	factoryFunctions: {
		authorDropdownFactory,
		categoriesCheckboxesFactory,
		nestedGridFactory
	},
	typeSafeFunctions: {
		typeSafeDropdown,
		typeSafeCheckboxes,
		typeSafeNestedGrid
	}
};

/**
 * Usage in a model definition
 */
export function createBlogPostModel() {
	return {
		name: "BlogPost",
		label: "Blog Post",
		fields: [
			// Use specific LinkedContent classes for better type safety
			authorDropdown,
			categoriesCheckboxes,
			productsSearchListBox,
			nestedItemsGrid
		]
	};
}
