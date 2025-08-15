# LinkedContent Field Classes

This document describes the specific LinkedContent field classes that have been split from the generic `ContentField` class for better type safety and more specific functionality.

## Available Classes

### 1. LinkedContentDropdown

For creating dropdown selection fields that reference other content.

**Use Case**: Single selection from a list of content items (e.g., selecting an author for an article).

```typescript
import {LinkedContentDropdown} from "@/lib/types"

const authorDropdown = new LinkedContentDropdown(
	"author",
	"Article Author",
	"author", // content definition
	"name", // text field to display
	"contentID", // value field to store
	"Select the author for this article"
)
	.withContentView("_newcontent_agility_")
	.withDisplayColumn("name")
```

### 2. LinkedContentCheckboxes

For creating checkbox selection fields that allow multiple content selections.

**Use Case**: Multiple selection from content items (e.g., selecting multiple categories for an article).

```typescript
import {LinkedContentCheckboxes} from "@/lib/types"

const categoriesCheckboxes = new LinkedContentCheckboxes(
	"categories",
	"Article Categories",
	"category",
	"Select one or more categories",
	"_newcontent_agility_"
)
```

### 3. LinkedContentSearchListBox

For creating searchable list box fields for content selection.

**Use Case**: Searchable selection from a large list of content items (e.g., selecting products from a catalog).

```typescript
import {LinkedContentSearchListBox} from "@/lib/types"

const productsSearchListBox = new LinkedContentSearchListBox(
	"relatedProducts",
	"Related Products",
	"product",
	"Search and select related products"
).withDefaultColumns("name,price,category")
```

### 4. LinkedContentNestedGrid

For creating grid-based content management within nested content structures.

**Use Case**: Managing nested content items in a grid format (e.g., managing child items of a parent content).

```typescript
import {LinkedContentNestedGrid} from "@/lib/types"

const nestedItemsGrid = new LinkedContentNestedGrid(
	"childItems",
	"Child Items",
	"childitem",
	"Manage nested content items"
)
	.withSorting("title", "asc", "itemOrder")
	.withDefaultColumns("title,status,lastModified")
```

### 5. LinkedContentNestedLink

For creating simple nested content linking.

**Use Case**: Linking to parent or child content items in a hierarchical structure.

```typescript
import {LinkedContentNestedLink} from "@/lib/types"

const nestedLink = new LinkedContentNestedLink("parentItem", "Parent Item", "parentitem", "Link to parent content item")
```

### 6. LinkedContentSharedGrid

For creating grid-based management of shared content.

**Use Case**: Managing shared content that can be used across multiple pages or sections.

```typescript
import {LinkedContentSharedGrid} from "@/lib/types"

const sharedContentGrid = new LinkedContentSharedGrid(
	"sharedResources",
	"Shared Resources",
	"resource",
	"Manage shared resources across multiple pages"
)
	.withSorting("name", "asc")
	.withDefaultColumns("name,type,lastUpdated")
```

### 7. LinkedContentSharedLink

For creating simple shared content linking.

**Use Case**: Linking to shared content items that are used across multiple locations.

```typescript
import {LinkedContentSharedLink} from "@/lib/types"

const sharedLink = new LinkedContentSharedLink(
	"globalFooter",
	"Global Footer",
	"footer",
	"Link to shared footer content"
)
```

## Factory Functions

For easier creation of LinkedContent fields, you can use the provided factory functions:

### createLinkedContent Factory Object

```typescript
import {createLinkedContent} from "@/lib/types"

// Create a dropdown field
const authorDropdown = createLinkedContent.dropdown("author", "Author", "author", "name", "contentID", {
	description: "Select article author",
	contentView: "_newcontent_agility_",
	displayColumn: "name",
})

// Create checkboxes field
const categories = createLinkedContent.checkboxes("categories", "Categories", "category", {
	description: "Select categories",
	contentView: "_newcontent_agility_",
})
```

### Type-Safe createLinkedContentField Function

```typescript
import {createLinkedContentField} from "@/lib/types"

// Type-safe factory function with overloads
const typeSafeDropdown = createLinkedContentField("dropdown", "author", "Author", "author", "name", "contentID", {
	description: "Select author",
})

const typeSafeCheckboxes = createLinkedContentField("checkboxes", "tags", "Tags", "tag", {
	description: "Select tags",
})
```

## Migration from ContentField

If you were previously using the generic `ContentField` class, you can migrate to the specific classes:

### Before (Generic ContentField)

```typescript
const authorField = new ContentField("author", "Author", "author")
	.withRenderAs("dropdown")
	.withDropdownSettings("name", "contentID", "name")

const categoriesField = new ContentField("categories", "Categories", "category").withRenderAs("checkbox")
```

### After (Specific Classes)

```typescript
const authorField = new LinkedContentDropdown("author", "Author", "author", "name", "contentID").withDisplayColumn(
	"name"
)

const categoriesField = new LinkedContentCheckboxes("categories", "Categories", "category")
```

## Benefits of the Split

1. **Type Safety**: Each class has only the properties relevant to its specific use case
2. **Better IntelliSense**: IDEs can provide more accurate autocomplete and validation
3. **Clearer Intent**: The class name immediately indicates the field's behavior
4. **Easier Maintenance**: Changes to one field type don't affect others
5. **Better Documentation**: Each class can have specific documentation for its use case

## Backward Compatibility

The original `ContentField` class is still available but marked as deprecated. It will continue to work for existing code, but new development should use the specific LinkedContent classes.

## Example Usage in Model Definition

```typescript
import {LinkedContentDropdown, LinkedContentCheckboxes, LinkedContentNestedGrid} from "@/lib/types"

export function createBlogPostModel() {
	return {
		name: "BlogPost",
		label: "Blog Post",
		fields: [
			new LinkedContentDropdown("author", "Author", "author", "name", "contentID", "Select the article author"),
			new LinkedContentCheckboxes("categories", "Categories", "category", "Select article categories"),
			new LinkedContentNestedGrid("relatedArticles", "Related Articles", "article", "Manage related articles")
				.withSorting("publishDate", "desc")
				.withDefaultColumns("title,publishDate,status"),
		],
	}
}
```
