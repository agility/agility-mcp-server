import {
	createField,
	TextField,
	LongTextField,
	IntegerField,
	BooleanField,
	DateField,
	DropdownListField,
	ContentField,
	saveModel,
	type DropdownChoice
} from "@/lib/handlers/save-model";

/**
 * Example usage of the enhanced Field system for AI to create models more easily
 */

// Example 1: Using the createField helper functions (recommended for AI)
export async function createBlogPostModel(token: string, instanceGuid: string) {
	const fields = [
		createField.text("title", "Title", {
			description: "The title of the blog post",
			required: true,
			length: 200
		}),
		createField.longText("excerpt", "Excerpt", {
			description: "A short excerpt of the blog post",
			length: 500
		}),
		createField.html("content", "Content", {
			description: "The main content of the blog post",
			required: true
		}),
		createField.image("featuredImage", "Featured Image", {
			description: "The featured image for the blog post"
		}),
		createField.dropdown("status", "Status", [
			{ label: "Draft", value: "draft" },
			{ label: "Published", value: "published" },
			{ label: "Archived", value: "archived" }
		], {
			description: "The publication status",
			defaultValue: "draft"
		}),
		createField.date("publishDate", "Publish Date", {
			description: "When to publish this post",
			showTime: true
		}),
		createField.content("author", "Author", "author", {
			description: "The author of this blog post",
			renderAs: "dropdown"
		}).withDropdownSettings("name", "id", "name"),
		createField.content("categories", "Categories", "category", {
			description: "Categories for this blog post",
			renderAs: "checkbox"
		})
	];

	return await saveModel({
		token,
		instanceGuid,
		displayName: "Blog Post",
		referenceName: "blogpost",
		description: "A blog post content model",
		fields,
		contentDefinitionTypeID: 1 // Content model
	});
}

// Example 2: Using the Field classes directly with builder pattern
export async function createProductModel(token: string, instanceGuid: string) {
	const fields = [
		new TextField("name", "Product Name", "The name of the product", true, false, undefined, 100),
		new TextField("sku", "SKU", "Product SKU", true, true),
		new LongTextField("description", "Description", "Product description"),
		new IntegerField("price", "Price", "Price in cents", true),
		new BooleanField("inStock", "In Stock", "Whether the product is in stock", false, true),
		new DropdownListField("category", "Category", [
			{ label: "Electronics", value: "electronics" },
			{ label: "Clothing", value: "clothing" },
			{ label: "Books", value: "books" },
			{ label: "Home & Garden", value: "home-garden" }
		], "Product category", true),
		new ContentField("relatedProducts", "Related Products", "product", "Related products", false, "_newcontent_agility_", "grid")
			.withGridSettings("name", "asc", "name,price,category")
	];

	return await saveModel({
		token,
		instanceGuid,
		displayName: "Product",
		referenceName: "product",
		description: "A product content model for e-commerce",
		fields,
		contentDefinitionTypeID: 1
	});
}

// Example 3: Creating a component model
export async function createHeroComponentModel(token: string, instanceGuid: string) {
	const fields = [
		createField.text("headline", "Headline", {
			description: "The main headline",
			required: true,
			length: 100
		}),
		createField.longText("subheadline", "Subheadline", {
			description: "Supporting text",
			length: 200
		}),
		createField.image("backgroundImage", "Background Image", {
			description: "Hero background image",
			required: true
		}),
		createField.text("ctaText", "CTA Text", {
			description: "Call to action button text",
			defaultValue: "Learn More"
		}),
		createField.link("ctaLink", "CTA Link", {
			description: "Call to action link"
		}),
		createField.dropdown("alignment", "Text Alignment", [
			{ label: "Left", value: "left" },
			{ label: "Center", value: "center" },
			{ label: "Right", value: "right" }
		], {
			description: "Text alignment",
			defaultValue: "center"
		})
	];

	return await saveModel({
		token,
		instanceGuid,
		displayName: "Hero Component",
		referenceName: "hero",
		description: "A hero banner component",
		fields,
		contentDefinitionTypeID: 2 // Component model
	});
}

// Example 4: Complex content field with all options
export async function createNewsArticleModel(token: string, instanceGuid: string) {
	const authorField = new ContentField(
		"author",
		"Author",
		"author",
		"Article author",
		true
	)
		.withContentView("authors")
		.withRenderAs("dropdown")
		.withDropdownSettings("displayName", "contentID", "name");

	const categoriesField = new ContentField(
		"categories",
		"Categories",
		"category",
		"Article categories"
	)
		.withContentView("categories")
		.withRenderAs("checkbox");

	const relatedArticlesField = new ContentField(
		"relatedArticles",
		"Related Articles",
		"newsarticle",
		"Related news articles"
	)
		.withContentView("news")
		.withRenderAs("grid")
		.withGridSettings("title", "desc", "title,publishDate,author", "sortID");

	const fields = [
		createField.text("title", "Title", { required: true, length: 150 }),
		createField.longText("summary", "Summary", { required: true, length: 300 }),
		createField.html("body", "Article Body", { required: true }),
		createField.image("featuredImage", "Featured Image"),
		createField.date("publishDate", "Publish Date", { required: true, showTime: true }),
		authorField,
		categoriesField,
		relatedArticlesField,
		createField.boolean("featured", "Featured Article", { defaultValue: false }),
		createField.integer("readTime", "Estimated Read Time", { description: "In minutes" })
	];

	return await saveModel({
		token,
		instanceGuid,
		displayName: "News Article",
		referenceName: "newsarticle",
		description: "A news article content model with rich relationships",
		fields,
		contentDefinitionTypeID: 1
	});
}
