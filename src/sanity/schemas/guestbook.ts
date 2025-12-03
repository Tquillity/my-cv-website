import { defineField, defineType } from "sanity";

export default defineType({
  name: "guestbook",
  title: "Guestbook",
  type: "document",
  fields: [
    defineField({
      name: "address",
      title: "Wallet Address",
      type: "string",
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
    }),
    defineField({
      name: "signature",
      title: "Signature",
      type: "string",
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
    }),
  ],
});

