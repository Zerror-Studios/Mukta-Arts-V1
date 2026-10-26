import { film } from './film'
import {
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

export const schema = {
  types: [
    film,
    investorCategory,
    investorRelations,
    investorSection,
    investorYear,
    investorDocument,
    scriptSubmission,
  ],
  // Keeps singletons and form submissions out of the studio's "Create" menu
  templates: (templates) =>
    templates.filter(({ schemaType }) => !singletonTypes.has(schemaType) && !formOnlyTypes.has(schemaType)),
}
