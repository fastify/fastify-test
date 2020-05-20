'use strict'

module.exports = async function (fastify, opts) {
  fastify.decorate('success2', true)
}
