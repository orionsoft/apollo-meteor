/* global Npm */
import {check} from 'meteor/check'
import {Accounts} from 'meteor/accounts-base'
import {Meteor} from 'meteor/meteor'
const Fiber = Npm.require('fibers')

export default function ({req}) {
  // Get the token from the header
  if (!req.headers.authorization) return {}

  const token = req.headers.authorization
  check(token, String)
  const hashedToken = Accounts._hashLoginToken(token)

  // Get the user from the database
  const user = Meteor.users.findOne({'services.resume.loginTokens.hashedToken': hashedToken}, { fields: { _id: 1, 'services.resume.loginTokens.$': 1 } })

  if (!user) return {}
  const expiresAt = Accounts._tokenExpiration(user.services.resume.loginTokens[0].when)
  const isExpired = expiresAt < new Date()
  if (isExpired) return {}

  const context = {
    userId: user._id,
    loginToken: token
  }

  // This allows us to pass the userId to other parts in meteor
  Fiber.current.graphQLContext = context

  return context
}
