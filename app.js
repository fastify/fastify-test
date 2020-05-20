'use strict'

module.exports = async function (fastify, opts) {
  fastify.decorate('success', true)
  if (opts.set === true) fastify.decorate('optsSet', true)
}
