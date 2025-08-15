# Content Fields Required Attribute Removal

## Summary

Removed the `required` attribute from all LinkedContent field constructors since content fields cannot be required in Agility CMS.

## Files Modified

### LinkedContent Classes

- `linked-content-dropdown.ts` - Removed `required` parameter from constructor
- `linked-content-checkboxes.ts` - Removed `required` parameter from constructor
- `linked-content-search-listbox.ts` - Removed `required` parameter from constructor
- `linked-content-nested-grid.ts` - Removed `required` parameter from constructor
- `linked-content-nested-link.ts` - Removed `required` parameter from constructor
- `linked-content-shared-grid.ts` - Removed `required` parameter from constructor
- `linked-content-shared-link.ts` - Removed `required` parameter from constructor

### Factory Functions

- `linked-content-factory.ts` - Removed `required` option from all factory function options

### Examples and Documentation

- `linked-content-examples.ts` - Updated all examples to remove `required` parameter usage
- `LINKED_CONTENT_CLASSES.md` - Updated documentation examples to remove `required` references

## Changes Made

### Constructor Signature Changes

**Before:**

```typescript
constructor(
  name: string,
  label: string,
  contentDefinition: string,
  description?: string,
  required?: boolean,  // ← Removed this parameter
  contentView?: string
)
```

**After:**

```typescript
constructor(
  name: string,
  label: string,
  contentDefinition: string,
  description?: string,
  contentView?: string
)
```

### Factory Function Changes

**Before:**

```typescript
options?: {
  description?: string;
  required?: boolean;  // ← Removed this option
  contentView?: string;
}
```

**After:**

```typescript
options?: {
  description?: string;
  contentView?: string;
}
```

### Base Class Call

All constructors now call `super(name, label, description, false)` with `false` hardcoded for the required parameter, since content fields cannot be required.

## Impact

- **Breaking Change**: Existing code using the `required` parameter will need to be updated
- **Type Safety**: TypeScript will catch any attempts to use the removed `required` parameter
- **Consistency**: All LinkedContent fields now correctly reflect that they cannot be required
- **Documentation**: All examples and documentation updated to reflect the change

## Build Status

✅ All files compile successfully
✅ No TypeScript errors
✅ Next.js build passes
