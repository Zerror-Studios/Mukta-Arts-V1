import { film } from './film'
import {
  boardMeetingYear,
  investorBoardMeetings,
  investorCategory,
  investorDocument,
  investorRelations,
  investorSection,
  investorYear,
} from './investorRelations'
import { scriptSubmission } from './scriptSubmission'

// Edited in place as one fixed document (see structure.js), never created, duplicated or deleted
export const singletonTypes = new Set(['investorRelations'])

// Only ever created by a form on the website, never in the studio
export const formOnlyTypes = new Set(['scriptSubmission'])

// Created from inside a Board Meetings list, which fills in its list (see structure.js)
export const BOARD_MEETING_YEAR_TEMPLATE = 'boardMeetingYear-in-list'

export const schema = {
  types: [
    film,
    investorCategory,
    investorRelations,
    investorSection,
    investorBoardMeetings,
    investorYear,
    investorDocument,
    boardMeetingYear,
    scriptSubmission,
  ],
  // Keeps singletons and form submissions out of the studio's "Create" menu, and Board Meetings years too: the
  // template that replaces theirs needs a list, and the "Create" menu leaves out templates that need anything
  templates: (templates) => [
    ...templates.filter(
      ({ schemaType }) =>
        !singletonTypes.has(schemaType) && !formOnlyTypes.has(schemaType) && schemaType !== 'boardMeetingYear'
    ),
    {
      id: BOARD_MEETING_YEAR_TEMPLATE,
      title: 'Board Meetings year',
      schemaType: 'boardMeetingYear',
      parameters: [{ name: 'list', type: 'string' }],
      value: ({ list }) => ({ list }),
    },
  ],
}
