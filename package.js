/* global Package */

Package.describe({
  name: 'orionsoft:apollo',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Server side only apollo integration',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/orionsoft/apollo-meteor',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
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
