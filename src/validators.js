import { parseNewCollectionName } from "./parsers";

function validateResponse(response) {
  const message = response.message
  if (!message || message === '') {
    throw 'Message cannot be empty'
  }
}

function validateAndParseNewCollectionName(context) {
  const newCollectionName = context.collection
  if (!newCollectionName || newCollectionName === '') throw 'Collection name cannot be empty'
  const collectionName = parseNewCollectionName(newCollectionName)

  if (context.existingCollections) {
    context.existingCollections.forEach(collection => {
      if (collection.toUpperCase() === collectionName.toUpperCase()) {
        throw 'Collection name cannot be the same as an existing collection'
      }
    })
  }

  return collectionName
}

export { validateResponse, validateAndParseNewCollectionName }