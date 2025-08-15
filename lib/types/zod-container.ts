import { z } from 'zod';
import { Container, ContentViewColumn } from '@agility/management-sdk';

// Zod schema for ContentViewColumn
export const ContentViewColumnSchema = z.object({
	sortOrder: z.number().nullable(),
	fieldName: z.string().nullable(),
	label: z.string().nullable(),
	isDefaultSort: z.boolean().nullable(),
	sortDirection: z.string().nullable(),
	typeName: z.string().nullable(),
});

// Zod schema for Container
export const ContainerSchema = z.object({
	defaultGridColumns: z.array(ContentViewColumnSchema).describe("Array of the default grid columns"),
	ID: z.number().nullable(),
	modelID: z.number().nullable().describe("The ID of the model that this container uses."),
	referenceName: z.string().nullable().describe("The reference name of the container. This is used to identify the container in code and should be unique. It will be auto-assigned when creating a new container."),
	displayName: z.string().nullable().describe("The display name of the container. This is used to show the container in the UI."),
	modelTypeID: z.number().describe("The type ID of the model that this container uses.  0 is a single item, 1 as a list."),
	requiresApproval: z.boolean().nullable().default(true).describe("Whether approval is required for items in this container."),

	lastModifiedDate: z.string().nullable().optional(),
	lastModifiedOn: z.string().nullable().optional(),
	lastModifiedBy: z.string().nullable().optional(),
	isShared: z.boolean().nullable().describe("Whether this container is shared or not. A container will only show up in the container listing if it's shared OR a dynamic page list."),
	isDynamicPageList: z.boolean().nullable().describe("Whether this container is a dynamic page list or not.  Enabling will make the SEO values appear in the UI for items in this list. Containers only show up in the listing if they are shared or a dynamic page list."),

	categoryID: z.number().nullable().optional().describe("The category ID for this container."),
	categoryReferenceName: z.string().nullable().optional().describe("The reference name of the category for this container."),
	categoryName: z.string().nullable().optional().describe("The name of the category for this container."),

	defaultListingPage: z.string().nullable().optional().describe("The default listing page for this container. This is used when the user previews the listing from the UI.  eg: ~/blog"),
	defaultDetailsPage: z.string().nullable().optional().describe("The default details page for this container. This is used when the user previews an item in this list from the UI. eg: ~/blog/blog-details"),
	defaultDetailsPageQueryString: z.string().nullable().optional().default("ContentID").describe("The default query string parameter to use for for the details page of this container. This is used when the user previews from the UI."),
}).describe("Schema for an Agility Container, representing a content list or single item. If it's a list, set the isDynamicPageList flag to true and the modelType to 1.  If it's a single item, set the isShared to 0 and the modelType to 0.");

// Type inference from the Zod schema
export type ZodContainer = z.infer<typeof ContainerSchema>;
export type ZodContentViewColumn = z.infer<typeof ContentViewColumnSchema>;

// Conversion functions between Container (SDK) and ZodContainer

/**
 * Converts a Container from @agility/management-sdk to a ZodContainer
 * @param container - The Container object from the SDK
 * @returns ZodContainer - The validated Zod container object
 */
export function containerToZodContainer(container: Container): ZodContainer {
	// Map the Container properties to ZodContainer structure
	const zodContainer = {
		defaultGridColumns: container.columns?.map((column: any) => ({
			sortOrder: column.sortOrder ?? null,
			fieldName: column.fieldName ?? null,
			label: column.label ?? null,
			isDefaultSort: column.isDefaultSort ?? null,
			sortDirection: column.sortDirection ?? null,
			typeName: column.typeName ?? null,
		})) ?? [],
		ID: container.contentViewID ?? null,
		modelID: container.contentDefinitionID ?? null,
		referenceName: container.referenceName ?? null,
		displayName: container.contentViewName ?? null,
		modelTypeID: container.contentDefinitionType ?? 1,
		requiresApproval: container.requiresApproval ?? true,
		lastModifiedDate: container.lastModifiedDate ?? null,
		lastModifiedOn: container.lastModifiedOn ?? null,
		lastModifiedBy: container.lastModifiedBy ?? null,
		isShared: container.isShared ?? null,
		isDynamicPageList: container.isDynamicPageList ?? null,
		categoryID: container.contentViewCategoryID ?? null,
		categoryReferenceName: container.contentViewCategoryReferenceName ?? null,
		categoryName: container.contentViewCategoryName ?? null,
		defaultListingPage: container.defaultListingPage ?? null,
		defaultDetailsPage: container.defaultDetailsPage ?? null,
		defaultDetailsPageQueryString: container.defaultDetailsPageQueryString ?? "ContentID",
	};

	// Validate with Zod schema and return
	return ContainerSchema.parse(zodContainer);
}

/**
 * Converts a ZodContainer to a Container object for use with @agility/management-sdk
 * @param zodContainer - The validated ZodContainer object
 * @returns Container - The Container object for the SDK
 */
export function zodContainerToContainer(zodContainer: ZodContainer): Container {
	// Create a new Container instance
	const container = new Container();

	// Map ZodContainer properties back to Container structure
	if (zodContainer.defaultGridColumns) {
		container.columns = zodContainer.defaultGridColumns.map(column => {
			const sdkColumn = new ContentViewColumn();
			sdkColumn.sortOrder = column.sortOrder;
			sdkColumn.fieldName = column.fieldName;
			sdkColumn.label = column.label;
			sdkColumn.isDefaultSort = column.isDefaultSort;
			sdkColumn.sortDirection = column.sortDirection;
			sdkColumn.typeName = column.typeName;
			return sdkColumn;
		});
	} else {
		container.columns = [];
	}

	container.contentViewID = zodContainer.ID;
	container.contentDefinitionID = zodContainer.modelID;
	container.referenceName = zodContainer.referenceName;
	container.contentViewName = zodContainer.displayName;
	container.contentDefinitionType = zodContainer.modelTypeID;
	container.requiresApproval = zodContainer.requiresApproval;
	container.lastModifiedDate = zodContainer.lastModifiedDate ?? null;
	container.lastModifiedOn = zodContainer.lastModifiedOn ?? null;
	container.lastModifiedBy = zodContainer.lastModifiedBy ?? null;
	container.isShared = zodContainer.isShared;
	container.isDynamicPageList = zodContainer.isDynamicPageList;
	container.contentViewCategoryID = zodContainer.categoryID ?? null;
	container.contentViewCategoryReferenceName = zodContainer.categoryReferenceName ?? null;
	container.contentViewCategoryName = zodContainer.categoryName ?? null;
	container.defaultListingPage = zodContainer.defaultListingPage ?? null;
	container.defaultDetailsPage = zodContainer.defaultDetailsPage ?? null;
	container.defaultDetailsPageQueryString = zodContainer.defaultDetailsPageQueryString ?? "ContentID";

	return container;
}

/**
 * Utility function to convert an array of Containers to ZodContainers
 * @param containers - Array of Container objects from the SDK
 * @returns Array of validated ZodContainer objects
 */
export function containersToZodContainers(containers: Container[]): ZodContainer[] {
	return containers.map(containerToZodContainer);
}

/**
 * Utility function to convert an array of ZodContainers to Containers
 * @param zodContainers - Array of ZodContainer objects
 * @returns Array of Container objects for the SDK
 */
export function zodContainersToContainers(zodContainers: ZodContainer[]): Container[] {
	return zodContainers.map(zodContainerToContainer);
}

/**
 * Example usage:
 *
 * // Converting from SDK Container to ZodContainer:
 * const sdkContainer: Container = await agilityClient.containerMethods.getContainer(...);
 * const validatedContainer: ZodContainer = containerToZodContainer(sdkContainer);
 *
 * // Converting from ZodContainer to SDK Container:
 * const zodContainer: ZodContainer = {
 *   defaultGridColumns: [],
 *   ID: null,
 *   modelID: 123,
 *   referenceName: "blog-posts",
 *   displayName: "Blog Posts",
 *   modelTypeID: 1,
 *   requiresApproval: true,
 *   // ... other properties
 * };
 * const sdkContainer: Container = zodContainerToContainer(zodContainer);
 * await agilityClient.containerMethods.saveContainer(sdkContainer, instanceGuid);
 *
 * // Converting arrays:
 * const containers: Container[] = await agilityClient.containerMethods.getContainerList(instanceGuid);
 * const validatedContainers: ZodContainer[] = containersToZodContainers(containers);
 */