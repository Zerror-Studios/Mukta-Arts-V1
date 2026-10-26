import { DECLARATION_KEYS } from '../../lib/scriptSubmission'

// The production dataset is public, so anyone can query it without a token, but never documents whose id is in a
// path ("<path>.<id>"): only a token or someone logged in to the studio can read those. Every submission goes
// in this one, which keeps writers' details and stories out of the public API.
export const SUBMISSION_ID_PATH = 'scriptSubmission'

// Uploads both files and creates the scriptSubmission document (../schemaTypes/scriptSubmission.js) with a client
// that can write to the dataset. Returns the new document's id.
// Called by src/app/api/script-submission/route.js with the checked, trimmed form values and the two files
// ([pitch deck, SWA certificate], each { filename, contentType, content }).
export async function saveScriptSubmission(client, values, files, submittedAt) {
  const [pitchDeck, swaCertificate] = await Promise.all(
    files.map(async (file) => {
      const asset = await client.assets.upload('file', file.content, {
        filename: file.filename,
        contentType: file.contentType,
      })
      return { _type: 'file', asset: { _type: 'reference', _ref: asset._id } }
    })
  )

  const isFilm = values.format === 'Feature Film'
  const isSeries = values.format === 'Web Series'
  const { _id } = await client.create({
    _id: `${SUBMISSION_ID_PATH}.${crypto.randomUUID()}`,
    _type: 'scriptSubmission',
    status: 'new',
    submittedAt: submittedAt.toISOString(),
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    phone: values.phone,
    title: values.title,
    format: values.format,
    genre: values.genre,
    // Left out (undefined) when they don't apply to this genre or format
    genreOther: values.genre === 'Other' ? values.genreOther : undefined,
    runtime: isFilm ? Number(values.runtime) : undefined,
    episodes: isSeries ? Number(values.episodes) : undefined,
    episodeDuration: isSeries ? Number(values.episodeDuration) : undefined,
    logline: values.logline,
    synopsis: values.synopsis,
    swaNumber: values.swaNumber,
    pitchDeck,
    swaCertificate,
    declarations: Object.fromEntries(DECLARATION_KEYS.map((key) => [key, true])),
  })
  return _id
}
