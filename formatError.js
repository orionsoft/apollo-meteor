export default function(error) {
  if (!error.path) {
    console.warn(`GraphQL Error: ${error.message}`)
    return {
      message: error.message,
      reason: error.reason,
      path: error.path
    }
  }
  console.warn(`GraphQL error on "${error.path.reverse().join('.')}"`)
  console.warn(
    error.stack
      .split('\n')
      .slice(0, 4)
      .join('\n')
  )
  let details = {}
  try {
    if (
      (error.originalError && error.originalError.invalidKeys) ||
      error.originalError.error === 'validation-error'
    ) {
      details.invalidKeys = {}
      const keys = error.originalError.invalidKeys || error.originalError.details
      keys.forEach(key => {
        let context = error.originalError.validationContext
        let message = key.message
        if (context) {
          message = context.keyErrorMessage(key.name)
        }
        details.invalidKeys[key.name] = message
      })
    }
  } catch (error) {
    console.log('Error in formatError:')
    console.log(error)
    console.log(error.stack)
  }
  return {
    message: error.message,
    reason: error.reason,
    path: error.path,
    details
  }
}
