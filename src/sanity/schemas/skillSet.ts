import { defineField, defineType } from "sanity";

export default defineType({
  name: "skillSet",
  title: "Skill Set",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "My Skills",
    }),
    defineField({
      name: "bio",
      title: "Professional Bio/Objective",
      type: "text",
    }),
    defineField({
      name: "bio_sv",
      title: "Professional Bio/Objective (Swedish)",
      type: "text",
    }),
    defineField({
      name: "skills",
      title: "Technical Skills",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "languages",
      title: "Languages",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "language", type: "string", title: "Language" },
            { name: "proficiency", type: "string", title: "Proficiency" },
          ],
        },
      ],
    }),
  ],
});
