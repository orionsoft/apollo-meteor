import {_} from 'meteor/underscore'

export default function ({req, context}) {
  const options = req.body[0]
  console.info(`New GraphQL query ${options.operationName}:`.underline.bold)
  console.info(`Token: ${context.loginToken}\n`.grey)
  console.info(options.query)
  if (options.variables) {
    try {
      if (_.isObject(options.variables)) {
        console.info('\n')
        console.info('Variables:'.underline)
        console.info(options.variables)
      } else {
        const obj = JSON.parse(options.variables)
        if (!_.isEmpty(obj)) {
          console.info('\n')
          console.info('Variables:'.underline)
          console.info('\n')
          console.info(obj)
        }
      }
    } catch (e) {}
  }
  console.info('\n')
}
