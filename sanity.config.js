'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\src\app\admin\[[...tool]]\page.jsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {formOnlyTypes, schema, singletonTypes} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'

// All a singleton needs: it can't be duplicated or deleted, since the site looks for it by its fixed id
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  basePath: '/admin',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  document: {
    actions: (actions, {schemaType}) => {
      if (singletonTypes.has(schemaType)) {
        return actions.filter(({action}) => action && singletonActions.has(action))
      }
      // Script submissions come from the website form, so a copy made here would be a fake submission
      if (formOnlyTypes.has(schemaType)) return actions.filter(({action}) => action !== 'duplicate')
      return actions
    },
  },
  plugins: [
    structureTool({structure}),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
