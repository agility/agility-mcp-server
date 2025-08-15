# Enhanced Field System for Agility CMS Models

This enhanced field system provides a type-safe, AI-friendly way to create Agility CMS models with proper field configurations. It replaces the manual settings object approach with strongly-typed field classes.

## Overview

Instead of manually creating field objects with complex settings strings, you can now use dedicated field classes that handle the proper settings generation automatically.

## Field Types Available

### Basic Field Types

#### TextField

Text input field with optional length validation.

```typescript
import {createField} from "@/lib/handlers/save-model"

const titleField = createField.text("title", "Title", {
	description: "The page title",
	required: true,
	length: 100,
	defaultValue: "New Page",
})
```

#### LongTextField

Multi-line text field for longer content.

```typescript
const descriptionField = createField.longText("description", "Description", {
	description: "Page description",
	length: 500,
})
```

#### HtmlField

Rich text editor field.

```typescript
const contentField = createField.html("content", "Content", {
	description: "Main page content",
	required: true,
})
```

#### IntegerField & DecimalField

Numeric fields with optional default values.

```typescript
const priceField = createField.integer("price", "Price", {
	description: "Price in cents",
	required: true,
	defaultValue: 0,
})

const ratingField = createField.decimal("rating", "Rating", {
	description: "Product rating",
	defaultValue: 0.0,
})
```

#### BooleanField

True/false checkbox field.

```typescript
const featuredField = createField.boolean("featured", "Featured", {
	description: "Mark as featured",
	defaultValue: false,
})
```

#### DateField

Date picker with optional time component.

```typescript
const publishDateField = createField.date("publishDate", "Publish Date", {
	description: "When to publish",
	showTime: true,
	required: true,
})
```

### Advanced Field Types

#### DropdownListField

Select field with predefined choices.

```typescript
const statusField = createField.dropdown(
	"status",
	"Status",
	[
		{label: "Draft", value: "draft"},
		{label: "Published", value: "published"},
		{label: "Archived", value: "archived"},
	],
	{
		description: "Publication status",
		defaultValue: "draft",
		required: true,
	}
)
```

#### FileAttachmentField & ImageAttachmentField

File upload fields.

```typescript
const documentField = createField.file("document", "Document", {
	description: "Attached document",
})

const imageField = createField.image("featuredImage", "Featured Image", {
	description: "Main image",
	required: true,
})
```

#### LinkField

URL/link field.

```typescript
const websiteField = createField.link("website", "Website", {
	description: "Company website URL",
})
```

#### ContentField

Reference to other content models (relationships).

```typescript
// Simple content reference
const authorField = createField.content("author", "Author", "author", {
	description: "Article author",
	required: true,
})

// Advanced content field with dropdown rendering
const authorDropdownField = new ContentField("author", "Author", "author", "Article author", true)
	.withRenderAs("dropdown")
	.withDropdownSettings("displayName", "contentID", "name")

// Content field with grid rendering
const relatedArticlesField = new ContentField("relatedArticles", "Related Articles", "article")
	.withRenderAs("grid")
	.withGridSettings("title", "desc", "title,publishDate,author")
```

## Using the Enhanced Model System

### Creating Models with the Enhanced System

```typescript
import {saveModelWithFields, createField} from "@/lib/handlers/save-model"

// Create a blog post model
const fields = [
	createField.text("title", "Title", {required: true, length: 200}),
	createField.longText("excerpt", "Excerpt", {length: 500}),
	createField.html("content", "Content", {required: true}),
	createField.image("featuredImage", "Featured Image"),
	createField.dropdown(
		"status",
		"Status",
		[
			{label: "Draft", value: "draft"},
			{label: "Published", value: "published"},
		],
		{defaultValue: "draft"}
	),
	createField.date("publishDate", "Publish Date", {showTime: true}),
	createField.boolean("featured", "Featured", {defaultValue: false}),
]

// Save the model
const model = await saveModelWithFields({
	token,
	instanceGuid,
	displayName: "Blog Post",
	referenceName: "blogpost",
	description: "A blog post content model",
	fields,
	contentDefinitionTypeID: 1, // 1 for content models, 2 for components
})
```

### Creating Component Models

```typescript
// Hero component model
const heroFields = [
	createField.text("headline", "Headline", {required: true, length: 100}),
	createField.longText("subheadline", "Subheadline", {length: 200}),
	createField.image("backgroundImage", "Background Image", {required: true}),
	createField.text("ctaText", "CTA Text", {defaultValue: "Learn More"}),
	createField.link("ctaLink", "CTA Link"),
	createField.dropdown(
		"alignment",
		"Text Alignment",
		[
			{label: "Left", value: "left"},
			{label: "Center", value: "center"},
			{label: "Right", value: "right"},
		],
		{defaultValue: "center"}
	),
]

const heroComponent = await saveModelWithFields({
	token,
	instanceGuid,
	displayName: "Hero Component",
	referenceName: "hero",
	description: "A hero banner component",
	fields: heroFields,
	contentDefinitionTypeID: 2, // Component model
})
```

## Advanced Content Field Configurations

### Dropdown Content Fields

```typescript
const authorField = new ContentField("author", "Author", "author", "Select author", true)
	.withContentView("authors")
	.withRenderAs("dropdown")
	.withDropdownSettings("displayName", "contentID", "name")
```

### Grid Content Fields

```typescript
const relatedProductsField = new ContentField("relatedProducts", "Related Products", "product")
	.withContentView("products")
	.withRenderAs("grid")
	.withGridSettings("name", "asc", "name,price,category", "sortID")
```

### Checkbox Content Fields (Multiple Selection)

```typescript
const categoriesField = new ContentField("categories", "Categories", "category")
	.withContentView("categories")
	.withRenderAs("checkbox")
```

### Nested/Child Content Lists

```typescript
// Creates a new content list when the field is used
const childItemsField = new ContentField("childItems", "Child Items", "childitem")
	.withContentView("_newcontent_agility_")
	.withRenderAs("grid")
```

## Migration from Legacy System

If you have existing code using the old field format, you can gradually migrate:

### Old Way (Legacy)

```typescript
const field = {
	name: "title",
	label: "Title",
	type: "Text",
	settings: {
		Required: "true",
		Length: "100",
		DefaultValue: "New Page",
	},
}
```

### New Way (Enhanced)

```typescript
const field = createField.text("title", "Title", {
	required: true,
	length: 100,
	defaultValue: "New Page",
})
```

## Benefits for AI

1. **Type Safety**: All field properties are validated at compile time
2. **Intellisense**: Full autocomplete support for field options
3. **Self-Documenting**: Field types are clear from the class names
4. **Validation**: Zod schemas ensure proper field configuration
5. **Builder Pattern**: Fluent API for complex field configurations
6. **Error Prevention**: No more invalid settings strings or typos

## MCP Tools

Both legacy and enhanced MCP tools are available:

- `save_content_model` - Legacy format (backward compatible)
- `save_content_model_enhanced` - New enhanced format
- `save_component_model` - Legacy format (backward compatible)
- `save_component_model_enhanced` - New enhanced format

The enhanced tools accept the new field schema format and provide better validation and error messages.
