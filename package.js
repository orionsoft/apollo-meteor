/* global Package */

Package.describe({
  name: 'orionsoft:apollo',
  version: '0.1.5',
  summary: 'A better Apollo integration for Meteor only serverside',
  git: 'https://github.com/orionsoft/apollo-meteor',
  documentation: 'README.md'
})

Package.onUse(function(api) {
  api.versionsFrom('1.4.2.3')
  api.use('ecmascript')
  api.use('underscore')
  api.use('accounts-base')
  api.use('tmeasday:check-npm-versions@0.3.1')
  api.use('nooitaf:colors@1.1.2')
  api.use('check')
  api.mainModule('apollo.js', 'server')
})

Package.onTest(function(api) {
  api.use('ecmascript')
  api.use('tinytest')
  api.use('orionsoft:apollo')
  api.mainModule('apollo-tests.js')
})
