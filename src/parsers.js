function parseFileNames(files) {
  if (!files) { throw 'You don\'t have any collection markdown files in ../collections' }

  const markdownFiles = files.filter(f => f.includes('.md'))
  const trimmedFileNames = markdownFiles.map(f => f.replace('.md', ''))
  return trimmedFileNames
}

export { parseFileNames }