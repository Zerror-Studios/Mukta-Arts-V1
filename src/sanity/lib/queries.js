import { client } from './client'

// A film without a poster is skipped: urlFor() throws on it, which would take down the whole page
const FILM_FILTER = `_type == "film" && defined(slug.current) && defined(poster.asset)`
const FILM_FIELDS = `title, "slug": slug.current, year, description, poster`

// Every page load asks Sanity directly (no CDN, no Next cache), so edits show on the next reload
const fetchFresh = (query, params = {}) =>
  client.fetch(query, params, { cache: 'no-store' })

export const getFilms = () =>
  fetchFresh(`*[${FILM_FILTER}] | order(year asc, title asc) { ${FILM_FIELDS} }`)

export const getFilmSlugs = () =>
  fetchFresh(`*[${FILM_FILTER}] { "slug": slug.current, _updatedAt }`)

export const getFilm = (slug) =>
  fetchFresh(`*[${FILM_FILTER} && slug.current == $slug][0] { ${FILM_FIELDS} }`, { slug })
