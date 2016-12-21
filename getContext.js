import {check} from 'meteor/check'
import {Accounts} from 'meteor/accounts-base'
import {Meteor} from 'meteor/meteor'

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

  return {
    userId: user._id,
    loginToken: token
  }
}
