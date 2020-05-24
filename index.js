'use strict'
const fp = require('fastify-plugin')

const sharedInstances = new WeakMap()

function fastifyTest (fastify, tap, sharedPlugin) {
  if (sharedPlugin) {
    const sharedInstance = fastify()
    sharedInstance.register(fp(sharedPlugin))
    sharedInstances.set(sharedPlugin, sharedInstance)
  }
  tap.Test.prototype.fastify = function fastifyHarness (rootPlugin, opts = {}) {
    if (!rootPlugin) throw Error('rootPlugin is required')

    const t = this

    const instance = sharedInstances.get(sharedPlugin) || fastify()

    instance.register(fp(rootPlugin), opts)

    t.teardown(() => { instance.close() })

    return instance
  }
  return tap
}

module.exports = fastifyTest
