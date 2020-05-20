'use strict'
require('.')
const { test, beforeEach } = require('tap')
const { join } = require('path')

beforeEach(async () => {
  delete require.cache[require.resolve('.')]
  require('.')
})

test('adds t.fastify function', async ({ equal, fastify }) => {
  equal(typeof fastify, 'function')
})

test('loads app.js in project root', async ({ equal, fastify }) => {
  const app = fastify()
  await app.ready()
  equal(app.success, true)
})

test('can be awaited directly as shorthand for awaiting ready()', async ({ equal, fastify }) => {
  const app = await fastify()
  equal(app.success, true)
})

test('(silent container)', { silent: true }, async () => {
  delete require.cache[require.resolve('.')]
  process.env.FASTIFY_BOOT_PATH = join(__dirname, 'app2.js')
  require('.')
  test('root plugin autodetect path can be overriden with FASTIFY_BOOT_PATH env var', async ({ fastify, equal }) => {
    const app = await fastify()
    equal(app.success2, true)
  })
})

test('can be passed a root plugin for plugin test isolation', async ({ fastify, equal }) => {
  async function plugin (fastify, opts) {
    fastify.decorate('customRootPlugin', true)
  }
  const app = await fastify(plugin)
  equal(app.customRootPlugin, true)
})

test('can be passed opts with a root plugin', async ({ fastify, equal }) => {
  async function plugin (fastify, opts) {
    fastify.decorate(opts.name, opts.value)
  }
  const app = await fastify(plugin, { name: 'name', value: 'value' })
  equal(app.name, 'value')
})

test('can be passed a null plugin with opts to set opts of autoinject app.js', async ({ fastify, equal }) => {
  const app = await fastify(null, { set: true })
  equal(app.success, true)
  equal(app.optsSet, true)
})
