import { presentError } from './presentation'

function wrapTryCatch1(f) {
  return (x) => {
    try {
      return f(x)
    } catch (error) { presentError(error) }
  }
}

function wrapPromiseCatch0(f) {
  return () => {
    return f()
      .catch(error => presentError(error))
  }
}

function wrapPromiseCatch1(f) {
  return (x) => {
    return f(x)
      .catch(error => presentError(error))
  }
}

function wrapPromiseCatch3(f) {
  return (x) => {
    return (y) => {
      return (z) => {
        return f(x, y, z)
          .catch(error => presentError(error))
      }
    }
  }
}

module.exports = {
  wrapTryCatch1,
  wrapPromiseCatch0,
  wrapPromiseCatch1,
}