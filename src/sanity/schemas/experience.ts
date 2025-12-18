import { defineField, defineType } from "sanity";

export default defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    defineField({
      name: "company",
      title: "Company",
      type: "string",
    }),
    defineField({
      name: "title",
      title: "Job Title",
      type: "string",
    }),
    defineField({
      name: "title_sv",
      title: "Job Title (Swedish)",
      type: "string",
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "date",
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "date",
    }),
    defineField({
      name: "isCurrent",
      title: "Is Current Role?",
      type: "boolean",
    }),
    defineField({
      name: "isProminent",
      title: "Prominent / Highlight",
      type: "boolean",
      initialValue: true,
      description: "If true, shows in the main dashboard. If false, hidden behind 'Full History' toggle.",
    }),
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
      name: "skills",
      title: "Skills Used",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
});

