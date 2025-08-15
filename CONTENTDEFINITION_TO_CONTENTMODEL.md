# ContentDefinition to ContentModel Property Rename

## Summary

Renamed the `contentDefinition` property to `contentModel` across all LinkedContent field classes, while maintaining the same `ContentDefinition` key in the generated settings. The property now accepts both string and number types.

## Changes Made

### All LinkedContent Classes Updated:

1. **LinkedContentDropdown**
2. **LinkedContentCheckboxes**
3. **LinkedContentSearchListBox**
4. **LinkedContentNestedGrid**
5. **LinkedContentNestedLink**
6. **LinkedContentSharedGrid**
7. **LinkedContentSharedLink**

### Property Changes

**Before:**

```typescript
contentDefinition: string; // referenceName or ID of the Content model to link to

constructor(
  name: string,
  label: string,
  contentDefinition: string,
  // ...
) {
  this.contentDefinition = contentDefinition;
}

generateSettings(): Record<string, string> {
  settings.ContentDefinition = this.contentDefinition;
}
```

**After:**

```typescript
contentModel: string | number; // referenceName or ID of the Content model to link to

constructor(
  name: string,
  label: string,
  contentModel: string | number,
  // ...
) {
  this.contentModel = contentModel;
}

generateSettings(): Record<string, string> {
  settings.ContentDefinition = this.contentModel.toString();
}
```

### Factory Function Updates

**Before:**

```typescript
dropdown: (
	name: string,
	label: string,
	contentDefinition: string,
	textField: string,
	valueField: string
	// ...
) => {
	return new LinkedContentDropdown(
		name,
		label,
		contentDefinition,
		textField,
		valueField
		// ...
	)
}
```

**After:**

```typescript
dropdown: (
	name: string,
	label: string,
	contentModel: string | number,
	textField: string,
	valueField: string
	// ...
) => {
	return new LinkedContentDropdown(
		name,
		label,
		contentModel,
		textField,
		valueField
		// ...
	)
}
```

### Type-Safe Factory Overloads Updated

All function overloads in `createLinkedContentField` updated to use `contentModel: string | number` parameter.

## Key Benefits

1. **Better Naming**: `contentModel` is more descriptive than `contentDefinition`
2. **Type Flexibility**: Accepts both string (reference name) and number (ID)
3. **Backward Compatibility**: Still maps to the same `ContentDefinition` setting key
4. **Type Safety**: `.toString()` ensures proper string conversion for settings

## Usage Examples

### Using String Reference Name

```typescript
const dropdown = new LinkedContentDropdown(
	"author",
	"Author",
	"author", // string reference name
	"name",
	"contentID"
)
```

### Using Numeric ID

```typescript
const dropdown = new LinkedContentDropdown(
	"author",
	"Author",
	123, // numeric content model ID
	"name",
	"contentID"
)
```

### Factory Function Usage

```typescript
const dropdown = createLinkedContent.dropdown(
	"author",
	"Author",
	"author", // string or number
	"name",
	"contentID"
)
```

## Settings Output

Regardless of input type, the settings always contain a string value:

```typescript
// Input: contentModel = "author" or contentModel = 123
// Output: settings.ContentDefinition = "author" or "123"
```

## Breaking Changes

- **Constructor Parameter**: `contentDefinition` → `contentModel`
- **Property Name**: `contentDefinition` → `contentModel`
- **Type**: `string` → `string | number`

## Build Status

✅ All files compile successfully
✅ No TypeScript errors
✅ Next.js build passes
✅ Proper type conversion with `.toString()`
