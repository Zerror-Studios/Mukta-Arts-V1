import { submissionStatuses } from './schemaTypes/scriptSubmission'

const newestFirst = [{ field: 'submittedAt', direction: 'desc' }]

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure = (S) =>
  S.list()
    .title('Content')
    .items([
      ...S.documentTypeListItems().filter(
        (item) => !['investorCategory', 'investorRelations', 'scriptSubmission'].includes(item.getId())
      ),
      S.divider(),
      // Everything in the About page's Investor Relations section, in one place
      S.listItem()
        .title('Investor Relations')
        .id('investor-relations')
        .child(
          S.list()
            .title('Investor Relations')
            .items([
              S.listItem()
                .title('Tabs')
                .id('investorCategory')
                .schemaType('investorCategory')
                .child(
                  S.documentTypeList('investorCategory')
                    .title('Tabs')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                ),
              S.listItem()
                .title('Contact & Unclaimed Dividend')
                .id('investorRelations')
                .schemaType('investorRelations')
                .child(
                  S.document()
                    .schemaType('investorRelations')
                    .documentId('investorRelations')
                    .title('Contact & Unclaimed Dividend')
                ),
            ])
        ),
      S.divider(),
      // Sent from the Submit Script page: every submission, newest first, and the same split by status
      S.listItem()
        .title('Script Submissions')
        .id('script-submissions')
        .schemaType('scriptSubmission')
        .child(
          S.list()
            .title('Script Submissions')
            .items([
              S.listItem()
                .title('All submissions')
                .id('all')
                .schemaType('scriptSubmission')
                .child(S.documentTypeList('scriptSubmission').title('All submissions').defaultOrdering(newestFirst)),
              S.divider(),
              ...submissionStatuses.map(({ title, value }) =>
                S.listItem()
                  .title(title)
                  .id(value)
                  .schemaType('scriptSubmission')
                  .child(
                    S.documentList()
                      .title(title)
                      .schemaType('scriptSubmission')
                      .filter('_type == "scriptSubmission" && status == $status')
                      .params({ status: value })
                      .defaultOrdering(newestFirst)
                  )
              ),
            ])
        ),
    ])
