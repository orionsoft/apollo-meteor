/* global Npm */
import {DDP} from 'meteor/ddp'
import {Meteor} from 'meteor/meteor'
const Fiber = Npm.require('fibers')

DDP._CurrentInvocation.get = function () {
  Meteor._nodeCodeMustBeInFiber()

  if (Fiber.current._meteor_dynamics && Fiber.current._meteor_dynamics[this.slot]) {
    return Fiber.current._meteor_dynamics[this.slot]
  }

  if (!Fiber.current.graphQLContext) return

  return {
    userId: Fiber.current.graphQLContext.userId
  }
}
