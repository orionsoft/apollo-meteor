import './checkNpm'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import bodyParser from 'body-parser'
import express from 'express'
import {Meteor} from 'meteor/meteor'
import {WebApp} from 'meteor/webapp'
import {_} from 'meteor/underscore'
import log from './log'
import getContext from './getContext'
import './overrideDDP'

const defaultConfig = {
  path: '/graphql',
  maxAccountsCacheSizeInMB: 1,
  graphiql: true,
  graphiqlPath: '/graphiql',
  logCalls: true,
  graphiqlOptions: {
    passHeader: "'Authorization': localStorage['Meteor.loginToken']"
  },
  configServer: (graphQLServer) => {}
}

const defaultOptions = {
  formatError: error => ({
    message: error.message,
    locations: error.locations,
    path: error.path
  })
}

export const createApolloServer = (givenOptions, givenConfig) => {
  let graphiqlOptions = {...defaultConfig.graphiqlOptions, ...givenConfig.graphiqlOptions}
  let config = {...defaultConfig, ...givenConfig}
  config.graphiqlOptions = graphiqlOptions

  const graphQLServer = express()

  config.configServer(graphQLServer)

  // GraphQL endpoint
  graphQLServer.use(config.path, bodyParser.json(), graphqlExpress((req) => {
    let options = _.isFunction(givenOptions) ? givenOptions(req) : givenOptions

    // Merge in the defaults
    options = {...defaultOptions, ...options}
    options.context = getContext({req})
    options.context.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

    if (config.logCalls) {
      log({req, context: options.context})
    }

    return options
  }))

  // Start GraphiQL if enabled
  if (config.graphiql) {
    const graphiql = graphiqlExpress({...config.graphiqlOptions, endpointURL: config.path})
    graphQLServer.use(config.graphiqlPath, graphiql)
  }

  // This binds the specified paths to the Express server running Apollo + GraphiQL
  WebApp.connectHandlers.use(Meteor.bindEnvironment(graphQLServer))
}
