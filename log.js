import {_} from 'meteor/underscore'

export default function ({req, context}) {
  console.info(`New GraphQL query ${req.body.operationName}:`.underline.bold)
  console.info(`Token: ${context.loginToken}\n`.grey)
  console.info(req.body.query)
  if (req.body.variables) {
    try {
      if (_.isObject(req.body.variables)) {
        console.info('\n')
        console.info('Variables:'.underline)
        console.info(req.body.variables)
      } else {
        const obj = JSON.parse(req.body.variables)
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
