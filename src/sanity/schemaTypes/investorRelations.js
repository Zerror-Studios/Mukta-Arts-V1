import { defineArrayMember, defineField, defineType } from 'sanity'

// The Investor Relations section on the About page (src/components/about/InvestorRelations.jsx):
// one Investor Relations Tab document per tab, and the Contact & Unclaimed Dividend document beside them.

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

const documentsField = defineField({
  name: 'documents',
  title: 'Documents',
  description: 'Listed in this order. Drag to reorder.',
  type: 'array',
  of: [defineArrayMember({ type: 'investorDocument' })],
})

// One downloadable file
export const investorDocument = defineType({
  name: 'investorDocument',
  title: 'Document',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'file',
      title: 'File',
      description: 'PDF, Word or Excel. PDFs can also be viewed on the page; the others are download only.',
      type: 'file',
      options: { accept: '.pdf,.doc,.docx,.xls,.xlsx' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      description: 'Optional. Shown beside the title.',
      type: 'date',
      options: { dateFormat: 'DD.MM.YYYY' },
    }),
  ],
  preview: {
    select: { title: 'title', date: 'date', fileName: 'file.asset.originalFilename' },
    prepare: ({ title, date, fileName }) => ({
      title,
      subtitle: [date?.split('-').reverse().join('.'), fileName ?? 'No file uploaded'].filter(Boolean).join(' · '),
    }),
  },
})

// A year chip inside a section, e.g. "2026-2027" or "Annual General Meeting - 2026"
export const investorYear = defineType({
  name: 'investorYear',
  title: 'Year',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'For example 2026-2027, or Annual General Meeting - 2026 (shown as "AGM 2026").',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    documentsField,
  ],
  preview: {
    select: { title: 'title', documents: 'documents' },
    prepare: ({ title, documents }) => ({ title, subtitle: plural(documents?.length ?? 0, 'document') }),
  },
})

// A collapsible section within a tab, e.g. "Annual Reports"
export const investorSection = defineType({
  name: 'investorSection',
  title: 'Section',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'Leave empty to list the documents straight under the tab, without a collapsible heading.',
      type: 'string',
      // The year chips sit under the heading, so a section without one can't show them
      validation: (rule) =>
        rule.custom((title, { parent }) =>
          parent?.byYear && !title ? 'A section split by year needs a title.' : true
        ),
    }),
    defineField({
      name: 'byYear',
      title: 'Split by year',
      description: 'Group the documents under year chips, like Shareholding Pattern.',
      type: 'boolean',
      initialValue: false,
    }),
    { ...documentsField, hidden: ({ parent }) => parent?.byYear },
    defineField({
      name: 'years',
      title: 'Years',
      description: 'Newest first; the first year is the one shown when the section opens.',
      type: 'array',
      of: [defineArrayMember({ type: 'investorYear' })],
      hidden: ({ parent }) => !parent?.byYear,
    }),
  ],
  preview: {
    select: { title: 'title', byYear: 'byYear', documents: 'documents', years: 'years' },
    prepare: ({ title, byYear, documents, years }) => ({
      title: title || 'Documents (no heading)',
      subtitle: byYear ? plural(years?.length ?? 0, 'year') : plural(documents?.length ?? 0, 'document'),
    }),
  },
})

// One tab of documents, e.g. "Reports"
export const investorCategory = defineType({
  name: 'investorCategory',
  title: 'Investor Relations Tabs',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Position',
      description: 'Where the tab sits in the row: 1 is first, and the first tab is the one shown when the page opens.',
      type: 'number',
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      description: 'Optional. A paragraph shown above the documents.',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      description: 'Listed in this order. Drag to reorder.',
      type: 'array',
      of: [defineArrayMember({ type: 'investorSection' })],
    }),
  ],
  orderings: [{ title: 'Position', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', order: 'order' },
    prepare: ({ title, order }) => ({ title, subtitle: order ? `Tab ${order}` : '' }),
  },
})

// The contact details and the Unclaimed Dividend documents, in the left column. There is only ever
// one of these (see structure.js), so it is edited in place rather than created.
export const investorRelations = defineType({
  name: 'investorRelations',
  title: 'Contact & Unclaimed Dividend',
  type: 'document',
  fieldsets: [{ name: 'contact', title: 'Contact for investor grievances' }],
  fields: [
    defineField({
      name: 'contactName',
      title: 'Name',
      type: 'string',
      fieldset: 'contact',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contactRole',
      title: 'Role',
      type: 'string',
      fieldset: 'contact',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contactPhone',
      title: 'Telephone',
      type: 'string',
      fieldset: 'contact',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contactEmail',
      title: 'Email',
      type: 'email',
      fieldset: 'contact',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'unclaimedDividend',
      title: 'Unclaimed Dividend',
      description: 'Opened from the button under the contact details.',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Button label',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'intro',
          title: 'Introduction',
          type: 'text',
          rows: 4,
        }),
        defineField({
          name: 'link',
          title: 'Link after the introduction',
          description: 'Optional, e.g. the IEPF Authority refund page.',
          type: 'url',
        }),
        documentsField,
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Contact & Unclaimed Dividend' }),
  },
})
