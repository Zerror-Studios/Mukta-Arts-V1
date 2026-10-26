import { defineField, defineType } from 'sanity'

// One submission from the Submit Script page (src/components/submit-script/SubmitScriptPage.jsx), saved by
// src/app/api/script-submission/route.js (see src/sanity/lib/saveScriptSubmission.js). What the writer sent is
// read only; Status is for the team to track where each submission stands.

export const submissionStatuses = [
  { title: 'New', value: 'new' },
  { title: 'In review', value: 'reviewing' },
  { title: 'Shortlisted', value: 'shortlisted' },
  { title: 'Declined', value: 'declined' },
]

// A field as the writer filled it in
const sent = (field) => defineField({ ...field, readOnly: true })

// Format-specific fields (runtime, episodes, other genre) only show when the writer filled them in
const hiddenIfEmpty = ({ value }) => value === undefined || value === ''

export const scriptSubmission = defineType({
  name: 'scriptSubmission',
  title: 'Script Submissions',
  type: 'document',
  // A status change is saved straight away, without a draft to publish
  liveEdit: true,
  fieldsets: [
    { name: 'personal', title: 'Personal details' },
    { name: 'project', title: 'Project details' },
    { name: 'documents', title: 'Documents' },
  ],
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: submissionStatuses, layout: 'radio', direction: 'horizontal' },
      initialValue: 'new',
    }),
    sent({ name: 'submittedAt', title: 'Submitted', type: 'datetime' }),

    sent({ name: 'firstName', title: 'First name', type: 'string', fieldset: 'personal' }),
    sent({ name: 'lastName', title: 'Last name', type: 'string', fieldset: 'personal' }),
    sent({ name: 'email', title: 'Email', type: 'email', fieldset: 'personal' }),
    sent({ name: 'phone', title: 'Phone', type: 'string', fieldset: 'personal' }),

    sent({ name: 'title', title: 'Screenplay title', type: 'string', fieldset: 'project' }),
    sent({ name: 'format', title: 'Format', type: 'string', fieldset: 'project' }),
    sent({ name: 'genre', title: 'Genre', type: 'string', fieldset: 'project' }),
    sent({ name: 'genreOther', title: 'Genre (other)', type: 'string', fieldset: 'project', hidden: hiddenIfEmpty }),
    sent({ name: 'runtime', title: 'Duration (minutes)', type: 'number', fieldset: 'project', hidden: hiddenIfEmpty }),
    sent({ name: 'episodes', title: 'Number of episodes', type: 'number', fieldset: 'project', hidden: hiddenIfEmpty }),
    sent({
      name: 'episodeDuration',
      title: 'Duration per episode (minutes)',
      type: 'number',
      fieldset: 'project',
      hidden: hiddenIfEmpty,
    }),
    sent({ name: 'logline', title: 'Logline', type: 'text', rows: 3, fieldset: 'project' }),
    sent({ name: 'synopsis', title: 'Synopsis', type: 'text', rows: 14, fieldset: 'project' }),

    sent({ name: 'swaNumber', title: 'SWA registration number', type: 'string', fieldset: 'documents' }),
    sent({ name: 'pitchDeck', title: 'Pitch deck', type: 'file', fieldset: 'documents' }),
    sent({ name: 'swaCertificate', title: 'SWA registration certificate', type: 'file', fieldset: 'documents' }),

    sent({
      name: 'declarations',
      title: 'Declarations',
      description: 'The writer has to confirm all three before the form can be sent.',
      type: 'object',
      fields: [
        defineField({ name: 'swa', title: 'Screenplay registered with SWA', type: 'boolean' }),
        defineField({ name: 'author', title: 'Original author, or authorised to submit', type: 'boolean' }),
        defineField({ name: 'accurate', title: 'Details accurate, submission format followed', type: 'boolean' }),
      ],
    }),
  ],
  orderings: [
    { title: 'Newest first', name: 'submittedDesc', by: [{ field: 'submittedAt', direction: 'desc' }] },
    { title: 'Oldest first', name: 'submittedAsc', by: [{ field: 'submittedAt', direction: 'asc' }] },
  ],
  preview: {
    select: {
      title: 'title',
      firstName: 'firstName',
      lastName: 'lastName',
      format: 'format',
      status: 'status',
      submittedAt: 'submittedAt',
    },
    prepare: ({ title, firstName, lastName, format, status, submittedAt }) => ({
      title,
      subtitle: [
        submissionStatuses.find(({ value }) => value === status)?.title,
        [firstName, lastName].filter(Boolean).join(' '),
        format,
        submittedAt &&
          new Date(submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      ]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})
