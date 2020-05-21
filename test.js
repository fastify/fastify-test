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

test('can be awaited directly as shorthand for awaiting ready()', async ({ equal, fastify }) => {
  const app = await fastify(async (instance) => {
    instance.decorate('success', true)
  })
  equal(app.success, true)
})

test('can be passed opts with a root plugin/app', async ({ fastify, equal }) => {
  async function plugin (fastify, opts) {
    fastify.decorate(opts.name, opts.value)
  }
  const app = await fastify(plugin, { name: 'name', value: 'value' })
  equal(app.name, 'value')
})

test('when awaited directly, rejects appropriately in error cases', async ({ equal, fastify }) => {
  try {
    await fastify(async () => {
      throw Error('test')
    })
  } catch (err) {
    equal(err.message, 'test')
  }
})

test('can be used a promise directly as shorthand for ready().then', ({ equal, fastify, end }) => {
  fastify(async (instance) => {
    instance.decorate('success', true)
  }).then((app) => {
    equal(app.success, true)
    end()
  })
})

test('when used a promise directly, rejects appropriately, .catch check', ({ equal, fastify, end }) => {
  fastify(async () => {
    throw Error('test')
  }).catch((err) => {
    equal(err.message, 'test')
    end()
  })
})

test('when used a promise directly, rejects appropriately, .then(_, failure) check', ({ equal, fastify, end }) => {
  fastify(async () => {
    throw Error('test')
  }).then(() => {}, (err) => {
    equal(err.message, 'test')
    end()
  })
})

test('when used a promise directly, rejects appropriately, .then().catch() check', ({ equal, fastify, end }) => {
  fastify(async () => {
    throw Error('test')
  }).then(() => {}).catch((err) => {
    equal(err.message, 'test')
    end()
  })
})
