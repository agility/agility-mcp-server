# ContentView Property Removal from Nested Classes

## Summary

Removed the `contentView` property from nested LinkedContent classes since it's always the same value. The value is now set directly in the `generateSettings()` method.

## Changes Made

### LinkedContentNestedGrid

**Before:**

```typescript
export class LinkedContentNestedGrid extends BaseField {
	type = "Content"
	contentDefinition: string
	contentView = NESTED_CONTENT_VIEW // ← Removed this property
	renderAs = "grid" as const
	// ...

	generateSettings(): Record<string, string> {
		// ...
		settings.ContentView = this.contentView // ← Used property
		// ...
	}
}
```

**After:**

```typescript
export class LinkedContentNestedGrid extends BaseField {
	type = "Content"
	contentDefinition: string
	renderAs = "grid" as const
	// ...

	generateSettings(): Record<string, string> {
		// ...
		settings.ContentView = NESTED_CONTENT_VIEW // ← Direct constant usage
		// ...
	}
}
```

### LinkedContentNestedLink

**Before:**

```typescript
export class LinkedContentNestedLink extends BaseField {
	type = "Content"
	contentDefinition: string
	contentView = NESTED_CONTENT_VIEW // ← Removed this property

	generateSettings(): Record<string, string> {
		// ...
		settings.ContentView = this.contentView // ← Used property
		// ...
	}
}
```

**After:**

```typescript
export class LinkedContentNestedLink extends BaseField {
	type = "Content"
	contentDefinition: string

	generateSettings(): Record<string, string> {
		// ...
		settings.ContentView = NESTED_CONTENT_VIEW // ← Direct constant usage
		// ...
	}
}
```

## Benefits

1. **Cleaner API**: The `contentView` property is no longer exposed to developers
2. **Immutable Behavior**: Cannot accidentally modify the contentView value
3. **Simpler Class Structure**: Fewer properties to maintain
4. **Clear Intent**: The constant is used directly where it's needed
5. **Type Safety**: No way to set an incorrect contentView value

## Impact

- **No Breaking Changes**: The classes still generate the same settings
- **Better Encapsulation**: Implementation detail is hidden from the public API
- **Cleaner IntelliSense**: Developers won't see irrelevant `contentView` property

## Build Status

✅ All files compile successfully
✅ No TypeScript errors
✅ Next.js build passes
✅ Functionality preserved
