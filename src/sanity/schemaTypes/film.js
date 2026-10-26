import { defineField, defineType } from 'sanity'

// One film on the Our Films page; its detail page lives at /our-films/<slug>
export const film = defineType({
  name: 'film',
  title: 'Films',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      description: 'The film page address, /our-films/<this>. Click Generate to make it from the title.',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'poster',
      title: 'Poster',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (rule) => rule.required().integer().min(1900).max(2100),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'Optional. Leave a blank line between paragraphs.',
      type: 'text',
      rows: 8,
    }),
  ],
  orderings: [
    { title: 'Year, oldest first', name: 'yearAsc', by: [{ field: 'year', direction: 'asc' }] },
    { title: 'Year, newest first', name: 'yearDesc', by: [{ field: 'year', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', year: 'year', media: 'poster' },
    prepare: ({ title, year, media }) => ({ title, subtitle: year ? String(year) : '', media }),
  },
})
