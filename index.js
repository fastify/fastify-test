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

    async function awaitable (resolve, reject) {
      const ready = instance.ready()
      try {
        await ready
        resolve(instance)
      } catch (err) {
        if (reject) reject(err)
        else throw err
      }
      return new Proxy(instance, {
        get (inst, p) {
          if (p === 'then' || p === 'catch') return async () => {}
          return inst[p]
        }
      })
    }

    const proxy = new Proxy(instance, {
      get (inst, p) {
        if (p === 'then') return awaitable
        if (p === 'catch') return (reject) => awaitable(() => {}, reject)
        return inst[p]
      }
    })

    return proxy
  }
  return tap
}
