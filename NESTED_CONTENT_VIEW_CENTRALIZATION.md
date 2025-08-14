# Nested Content View Centralization

## Summary

Centralized the `contentView` property for nested LinkedContent fields to always use the constant `"_newcontent_agility_"`.

## Changes Made

### 1. Created Constants File

- **File**: `lib/types/constants.ts`
- **Purpose**: Centralize commonly used constants
- **Constants**:
  - `NESTED_CONTENT_VIEW = "_newcontent_agility_"` - Always used for nested content
  - `DEFAULT_SORT_FIELD = "ItemOrder"` - Default sort field for grids
  - `DEFAULT_SORT_DIRECTION = "asc"` - Default sort direction

### 2. Updated LinkedContentNestedGrid

- **File**: `lib/types/linked-content-nested-grid.ts`
- **Changes**:
  - Import constants from `./constants`
  - Changed `contentView?: string` to `contentView = NESTED_CONTENT_VIEW`
  - Removed `contentView` parameter from constructor
  - Removed `withContentView()` method (no longer needed)
  - Updated `withSorting()` to use `DEFAULT_SORT_FIELD` and `DEFAULT_SORT_DIRECTION`
  - Always set `ContentView` in `generateSettings()` (no conditional check)

### 3. Updated LinkedContentNestedLink

- **File**: `lib/types/linked-content-nested-link.ts`
- **Changes**:
  - Import `NESTED_CONTENT_VIEW` constant
  - Changed `contentView?: string` to `contentView = NESTED_CONTENT_VIEW`
  - Removed `contentView` parameter from constructor
  - Removed `withContentView()` method (no longer needed)
  - Always set `ContentView` in `generateSettings()` (no conditional check)

### 4. Updated Factory Functions

- **File**: `lib/types/linked-content-factory.ts`
- **Changes**:
  - Removed `contentView` option from `nestedGrid()` factory function
  - Removed `contentView` option from `nestedLink()` factory function
  - Updated constructor calls to match new signatures

### 5. Updated Index Exports

- **File**: `lib/types/index.ts`
- **Changes**:
  - Added exports for all constants from `./constants`

## Constructor Signature Changes

### LinkedContentNestedGrid

**Before:**

```typescript
constructor(
  name: string,
  label: string,
  contentDefinition: string,
  description?: string,
  contentView?: string  // ← Removed
)
```

**After:**

```typescript
constructor(
  name: string,
  label: string,
  contentDefinition: string,
  description?: string
)
// contentView is now always NESTED_CONTENT_VIEW
```

### LinkedContentNestedLink

**Before:**

```typescript
constructor(
  name: string,
  label: string,
  contentDefinition: string,
  description?: string,
  contentView?: string  // ← Removed
)
```

**After:**

```typescript
constructor(
  name: string,
  label: string,
  contentDefinition: string,
  description?: string
)
// contentView is now always NESTED_CONTENT_VIEW
```

## Usage Examples

### Before

```typescript
const nestedGrid = new LinkedContentNestedGrid(
	"items",
	"Items",
	"item",
	"Description",
	"_newcontent_agility_" // Had to manually specify
)
```

### After

```typescript
const nestedGrid = new LinkedContentNestedGrid(
	"items",
	"Items",
	"item",
	"Description"
	// contentView automatically set to "_newcontent_agility_"
)
```

## Benefits

1. **Consistency**: All nested content fields always use the correct contentView
2. **Simplicity**: No need to remember or specify the contentView for nested fields
3. **Type Safety**: Cannot accidentally set wrong contentView for nested content
4. **Maintainability**: Single source of truth for the nested content view constant
5. **Developer Experience**: Fewer parameters to worry about when creating nested fields

## Build Status

✅ All files compile successfully
✅ No TypeScript errors
✅ Next.js build passes
