/* global Npm */
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import bodyParser from 'body-parser'
import express from 'express'
import {Meteor} from 'meteor/meteor'
import {WebApp} from 'meteor/webapp'
import {_} from 'meteor/underscore'
import log from './log'
import defaultGetContext from './getContext'
const Fiber = Npm.require('fibers')
import './overrideDDP'

const defaultOptions = {
  formatError(error) {
    console.warn(`GraphQL Error: ${error.message}`)
    if (!error.path) {
      return {
        message: error.message,
        reason: error.reason,
        path: error.path
      }
    }
    console.warn(`At ${error.path[0]}`)
    // console.error(error.stack)
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
}

const defaultConfig = {
  path: '/graphql',
  maxAccountsCacheSizeInMB: 1,
  graphiql: true,
  graphiqlPath: '/graphiql',
  logCalls: true,
  graphiqlOptions: {
    passHeader: "'Authorization': localStorage['Meteor.loginToken']"
  },
  configServer: graphQLServer => {},
  getContext: defaultGetContext
}

export const createApolloServer = (givenOptions, givenConfig) => {
  let graphiqlOptions = {...defaultConfig.graphiqlOptions, ...givenConfig.graphiqlOptions}
  let config = {...defaultConfig, ...givenConfig}
  config.graphiqlOptions = graphiqlOptions

  const graphQLServer = express()

  config.configServer(graphQLServer)

  const expressServer = graphqlExpress(req => {
    let options = _.isFunction(givenOptions) ? givenOptions(req) : givenOptions

    // Merge in the defaults
    options = {...defaultOptions, ...options}
    options.context = config.getContext(req)
    options.context.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    Fiber.current.graphQLContext = options.context

    if (config.logCalls) {
      log({req, context: options.context})
    }

    return options
  })

  // GraphQL endpoint
  graphQLServer.use(config.path, bodyParser.json(), Meteor.bindEnvironment(expressServer))

  // Start GraphiQL if enabled
  if (config.graphiql) {
    const graphiql = graphiqlExpress({...config.graphiqlOptions, endpointURL: config.path})
    graphQLServer.use(config.graphiqlPath, graphiql)
  }

  // This binds the specified paths to the Express server running Apollo + GraphiQL
  WebApp.connectHandlers.use(Meteor.bindEnvironment(graphQLServer))
}
