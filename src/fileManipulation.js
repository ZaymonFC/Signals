var fs = require('fs')
var path = require('path')

function getCollectionFileNames() {
  return new Promise((resolve, reject) => {
    fs.readdir(path.resolve(__dirname, '../collections'), (err, files) => {
      if (err) { reject('Something went wrong reading collections directory. Does it exist?') }

      resolve(files)
    })
  })
}

function collectionFilePath(collection) {
  const relativePath = `../collections/${collection}.md`
  return path.resolve(__dirname, relativePath)
}

async function readCollection(collectionName) {
  return new Promise((resolve, reject) => {
    const filePath = collectionFilePath(collectionName)

    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) reject(`Error ingesting data from collection ${collectionName}`)
      resolve(data)
    })
  })
}

function entryAppender(entry) {
  return new Promise((resolve, reject) => {
    const filePath = collectionFilePath(entry.collection)

    fs.appendFile(filePath, entry.entry, (err) => {
      if (err) reject(`Something happened trying to write a log to ${path}`)
      resolve()
    })
  })
}

function createCollectionFile(collectionName) {
  return new Promise((resolve, reject) => {
    const filePath = collectionFilePath(collectionName)

    fs.writeFile(filePath, '', (err) => {
      if (err) reject (`Something went wrong creating the file ${collectionName}`)
      resolve()
    })
  })
}

export {
  getCollectionFileNames,
  entryAppender,
  readCollection,
  createCollectionFile,
}
