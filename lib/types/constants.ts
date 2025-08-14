/**
 * Constants for Agility CMS field configurations
 */

/**
 * Content view identifier for nested content fields
 * This is always used for nested content that creates new content items
 */
export const NESTED_CONTENT_VIEW = "_newcontent_agility_" as const;

/**
 * Default sort field for grid-based content fields
 */
export const DEFAULT_SORT_FIELD = "ItemOrder" as const;

/**
 * Default sort direction for grid-based content fields
 */
export const DEFAULT_SORT_DIRECTION = "asc" as const;
