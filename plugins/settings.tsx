import { type DocumentDefinition } from 'sanity'
import { type StructureResolver } from 'sanity/structure'

// The StructureResolver is how we're changing the structure of the default document list
// https://www.sanity.io/docs/structure-builder-reference
export const pageStructure = (
  typeDefArray: DocumentDefinition[],
): StructureResolver => {
  return (S) => {
    // Goes through all of the singletons that were provided and translates them into something the
    // Structure tool can understand
    const singletonItems = typeDefArray.map((typeDef) => {
      return S.listItem()
        .title(typeDef.title || typeDef.name)
        .icon(typeDef.icon)
        .child(
          S.editor()
            .id(typeDef.name)
            .schemaType(typeDef.name)
            .documentId(typeDef.name),
        )
    })

    // The default root list items (except singletons)
    const defaultListItems = S.documentTypeListItems().filter(
      (listItem) =>
        !typeDefArray.find((singleton) => singleton.name === listItem.getId()),
    )

    return S.list()
      .title('Content')
      .items([...singletonItems, S.divider(), ...defaultListItems])
  }
}

export const singletonPlugin = (types: string[]) => {
  return {
    name: 'singletonPlugin',
    document: {
      // Hide singleton types from the global "Create new document" menu options
      newDocumentOptions: (
        prev: any[],
        { creationContext }: { creationContext: { type: string } },
      ) => {
        if (creationContext.type === 'global') {
          return prev.filter(
            (templateItem: any) => !types.includes(templateItem.templateId),
          )
        }
        return prev
      },
      // Prevent singletons from being duplicated
      actions: (prev: any[], { schemaType }: { schemaType: string }) => {
        if (types.includes(schemaType)) {
          return prev.filter(
            (prevAction: any) =>
              prevAction.action !== 'duplicate' &&
              prevAction.action !== 'delete' &&
              prevAction.action !== 'unpublish',
          )
        }
        return prev
      },
    },
  }
}
