/* global Package */

Package.describe({
  name: 'orionsoft:apollo',
  version: '0.0.1',
  summary: 'A better Apollo integration for Meteor',
  git: 'https://github.com/orionsoft/apollo-meteor',
  documentation: 'README.md'
})

Package.onUse(function (api) {
  api.versionsFrom('1.4.2.3')
  api.use('underscore')
  api.use('nooitaf:colors')
  api.use('check')
  api.use('ecmascript')
  api.mainModule('apollo.js')
})

Package.onTest(function (api) {
  api.use('ecmascript')
  api.use('tinytest')
  api.use('orionsoft:apollo')
  api.mainModule('apollo-tests.js')
})
