function validateResponse(response) {
  const message = response.message
  if (!message || message === '') {
    throw 'Message cannot be empty'
  }
}

export { validateResponse }