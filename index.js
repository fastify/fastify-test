'use strict'
const fp = require('fastify-plugin')
module.exports = fastifyTap

function fastifyTap (fastify, tap) {
  tap.Test.prototype.fastify = function fastifyHarness (rootPlugin, opts = {}) {
    if (!rootPlugin) throw Error('rootPlugin is required')

    const t = this

    const instance = fastify()

    instance.register(fp(rootPlugin), opts)

    t.teardown(() => { instance.close() })

    return instance
  }
  return tap
}
