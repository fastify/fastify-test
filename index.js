'use strict'
const fastify = require(require.resolve('fastify', require.main))
const fp = require('fastify-plugin')
const { Test } = require(require.resolve('tap', require.main))
const { dirname, join, resolve } = require('path')
const pkgUp = require('pkg-up')

const {
  FASTIFY_BOOT_PATH = join(dirname(pkgUp.sync()), 'app.js')
} = process.env
let app = null
try {
  app = require(resolve(dirname(pkgUp.sync()), FASTIFY_BOOT_PATH))
} catch (err) {}

Test.prototype.fastify = function fastifyHarness (rootPlugin = app, opts = {}) {
  if (!rootPlugin && app === null) throw Error('rootPlugin is required')
  if (rootPlugin === null) rootPlugin = app

  const t = this

  const instance = fastify()

  instance.register(fp(rootPlugin), opts)

  t.teardown(() => { instance.close() })

  return Object.create(instance, {
    then: {
      async value (res, rej) {
        const ready = instance.ready()
        try {
          await ready
          res(instance)
        } catch (e) { rej(e) }
        return ready
      }
    }
  })
}
