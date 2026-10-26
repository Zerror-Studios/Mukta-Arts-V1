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

// An entry still waiting for its file is skipped, so a half-filled document in the studio can't break the section.
// href is this site's own address for the file, passed through to the Sanity CDN by the rewrite in next.config.mjs.
const IR_DOCS = `coalesce(documents[defined(file.asset)] {
  _key, title, date,
  "href": "/investor-relations/files/" + file.asset->assetId + "." + file.asset->extension,
  "fileName": file.asset->originalFilename,
  "size": file.asset->size,
  "type": file.asset->extension
}, [])`

// A section has either docs or years (each with its own docs), as the "Split by year" switch says
export const getInvestorRelations = () =>
  fetchFresh(`{
    "categories": *[_type == "investorCategory"] | order(order asc, title asc) {
      _id, title, intro,
      "sections": coalesce(sections[] {
        _key, title,
        "docs": select(byYear != true => ${IR_DOCS}),
        "years": select(byYear == true => coalesce(years[] { _key, title, "docs": ${IR_DOCS} }, []))
      }, [])
    },
    "page": *[_id == "investorRelations"][0] {
      "contact": { "name": contactName, "role": contactRole, "phone": contactPhone, "email": contactEmail },
      "unclaimedDividend": unclaimedDividend { title, intro, link, "docs": ${IR_DOCS} }
    }
  }`)
