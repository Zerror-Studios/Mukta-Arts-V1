import { client } from './client'

const FILM_FIELDS = `title, "slug": slug.current, year, description, poster`

// Every page load asks Sanity directly (no CDN, no Next cache), so edits show on the next reload
const fetchFresh = (query, params = {}) =>
  client.fetch(query, params, { cache: 'no-store' })

export const getFilms = () =>
  fetchFresh(`*[_type == "film" && defined(slug.current)] | order(year asc, title asc) { ${FILM_FIELDS} }`)

export const getFilmSlugs = () =>
  fetchFresh(`*[_type == "film" && defined(slug.current)] { "slug": slug.current, _updatedAt }`)

export const getFilm = (slug) =>
  fetchFresh(`*[_type == "film" && slug.current == $slug][0] { ${FILM_FIELDS} }`, { slug })
