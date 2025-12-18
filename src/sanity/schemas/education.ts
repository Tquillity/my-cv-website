import { defineField, defineType } from "sanity";

export default defineType({
  name: "education",
  title: "Education",
  type: "document",
  fields: [
    defineField({
      name: "institution",
      title: "Institution",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "degree",
      title: "Degree",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "degree_sv",
      title: "Degree (Swedish)",
      type: "string",
    }),
    defineField({
      name: "isProminent",
      title: "Prominent / Highlight",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "date",
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
  ],
});
