import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions'

checkNpmVersions({
  'graphql-server-express': '*',
  'body-parser': '*',
  'express': '*',
  'graphql': '*',
  'graphql-tools': '*'
}, 'orionsoft:apollo')
