import { defineField, defineType } from "sanity";

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "title_sv",
      title: "Title (Swedish)",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "additionalImages",
      title: "Additional Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    // --- UPDATED TAGS FIELD ---
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "name",
              title: "Tag Name",
              type: "string",
              validation: (Rule) => Rule.required()
            },
            {
              name: "description",
              title: "Tooltip Description",
              type: "string",
              description: "Optional text to show on hover (e.g., 'RPM Download' or 'Browser Install')"
            },
            {
              name: "name_sv",
              title: "Tag Name (Swedish)",
              type: "string",
              description: "Swedish translation of the tag name"
            }
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'description'
            }
          }
        }
      ],
    }),
    // ---------------------------
    defineField({
      name: "githubUrl",
      title: "GitHub URL",
      type: "url",
    }),
    defineField({
      name: "liveUrl",
      title: "Live URL",
      type: "url",
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
    }),

    // --- NEW: Technical Case Study Section ---
    defineField({
      name: "caseStudy",
      title: "Technical Case Study",
      type: "object",
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: "problem",
          title: "The Problem",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "problem_sv",
          title: "The Problem (Swedish)",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "solution",
          title: "The Solution",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "solution_sv",
          title: "The Solution (Swedish)",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "architecture",
          title: "Architecture",
          type: "object",
          fields: [
            defineField({
              name: "description",
              title: "Description",
              type: "text",
            }),
            defineField({
              name: "description_sv",
              title: "Description (Swedish)",
              type: "text",
            }),
            defineField({
              name: "diagramType",
              title: "Diagram Type",
              type: "string",
              options: {
                list: [
                  { title: "None", value: "none" },
                  { title: "OmniComment Flow", value: "omnicomment-flow" },
                ],
              },
            }),
          ],
        }),
        defineField({
          name: "technicalChallenges",
          title: "Technical Challenges",
          type: "array",
          of: [
            {
              type: "object",
              title: "Challenge",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "title_sv", title: "Title (Swedish)", type: "string" }),
                defineField({ name: "description", title: "Description", type: "text" }),
                defineField({ name: "description_sv", title: "Description (Swedish)", type: "text" }),
              ],
            },
          ],
        }),
        defineField({
          name: "codeSnippets",
          title: "Code Snippets",
          type: "array",
          of: [
            {
              type: "object",
              title: "Snippet",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "title_sv", title: "Title (Swedish)", type: "string" }),
                defineField({ name: "language", title: "Language", type: "string" }),
                defineField({ name: "description", title: "Description", type: "string" }),
                defineField({ name: "description_sv", title: "Description (Swedish)", type: "string" }),
                defineField({
                  name: "code",
                  title: "Code",
                  type: "text",
                  rows: 10
                }),
              ],
            },
          ],
        }),
        defineField({
          name: "versionNotes",
          title: "Version Notes",
          type: "object",
          description: "Version-specific release notes and changelog information",
          options: {
            collapsible: true,
          },
          fields: [],
        }),
      ],
    }),

    // --- NEW: Software Downloads Section ---
    defineField({
      name: "downloads",
      title: "Software Downloads",
      type: "object",
      fields: [
        defineField({ name: "linux", title: "Linux Download URL", type: "string" }),
        defineField({ name: "windows", title: "Windows Download URL", type: "string" }),
        defineField({ name: "mac", title: "Mac Download URL", type: "string" }),
        defineField({
          name: "versionHistory",
          title: "Version History",
          type: "object",
          description: "Historical versions and their download links",
          options: {
            collapsible: true,
          },
          fields: [],
        }),
      ],
    }),
  ],
});
