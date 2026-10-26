import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Off so every request reads the latest published content instead of a CDN copy that can lag behind
  useCdn: false,
})
