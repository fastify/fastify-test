'use strict'
const tap = require('tap')
const fastify = require('fastify')
require('.')(fastify, tap)
const { test } = tap

test('adds t.fastify function', async ({ equal, fastify }) => {
  equal(typeof fastify, 'function')
})

test('throws if root plugin not provided', async ({ throws, fastify }) => {
  throws(() => fastify())
})

test('loads a root plugin/app', async ({ equal, fastify }) => {
  const app = fastify(async (instance) => {
    instance.decorate('success', true)
  })
  await app.ready()
  equal(app.success, true)
})

test('can be passed opts with a root plugin/app', async ({ fastify, equal }) => {
  async function plugin (fastify, opts) {
    fastify.decorate(opts.name, opts.value)
  }
  const app = fastify(plugin, { name: 'name', value: 'value' })
  await app.ready()
  equal(app.name, 'value')
})

test('rejects appropriately in error cases', async ({ equal, fastify }) => {
  try {
    await fastify(async () => {
      throw Error('test')
    }).ready()
  } catch (err) {
    equal(err.message, 'test')
  }
})
