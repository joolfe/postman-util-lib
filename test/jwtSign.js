'use strict'

const assert = require('assert')
const lib = require('../src/lib')
const { describe, it } = require('mocha')
const jsonwebtoken = require('jsonwebtoken')
const { JWT_PAYLOAD, expectError, JWK_PUBLIC_KEY, JWK_KEY, CLIENT_ID, AUD, PEM_PUB_KEY } = require('./test-helpers')

describe('jwtSign()', function () {
  it('Should generate signed jwt correctly with default params', function () {
    const jwt = lib.jwtSign(JWK_KEY)
    const decodeJwt = jsonwebtoken.verify(jwt, PEM_PUB_KEY)
    assert(decodeJwt.iat)
    assert(decodeJwt.nbf)
    assert(decodeJwt.exp)
    assert(decodeJwt.jti)
  })

  it('Should generate signed jwt correctly with all fields', function () {
    const jwt = lib.jwtSign(JWK_KEY, JWT_PAYLOAD, { test: 'here' }, 10, 'RS384')
    const decodeJwt = jsonwebtoken.verify(jwt, PEM_PUB_KEY)
    assert.strictEqual(decodeJwt.client_id, CLIENT_ID)
    assert.strictEqual(decodeJwt.iss, CLIENT_ID)
    assert.strictEqual(decodeJwt.aud, AUD)
    assert(decodeJwt.iat)
    assert(decodeJwt.nbf)
    assert(decodeJwt.exp)
    assert(decodeJwt.jti)
  })

  it('Should fail when no jwk provided', function () {
    assert.throws(
      () => lib.jwtSign(),
      expectError('Error', '[jwtSign] not supported argument')
    )
  })

  it('Should fail when null jwk provided', function () {
    assert.throws(
      () => lib.jwtSign(null),
      expectError('Error', '[jwtSign] Field jwk should be of type string,object')
    )
  })

  it("Should fail when jwk don't have the correct format", function () {
    assert.throws(
      () => lib.jwtSign('{ "hi": "hi" }'),
      expectError('Error', '[jwtSign] not supported argument')
    )
  })

  it("Should fail when jwk don't have a private key", function () {
    assert.throws(
      () => lib.jwtSign(JWK_PUBLIC_KEY),
      expectError('Error', '[jwtSign] Signature: unsupported private key alg: rsa')
    )
  })

  it('Should fail when no payload', function () {
    assert.throws(
      () => lib.jwtSign(JWK_KEY, null),
      expectError('Error', '[jwtSign] Field payload should be of type object')
    )
  })

  it("Should fail when incorrect 'header' field", function () {
    assert.throws(
      () => lib.jwtSign(JWK_KEY, JWT_PAYLOAD, null),
      expectError('Error', '[jwtSign] Field header should be of type object')
    )
  })

  it("Should fail when incorrect 'exp' field", function () {
    assert.throws(
      () => lib.jwtSign(JWK_KEY, JWT_PAYLOAD, {}, 'banan'),
      expectError('Error', '[jwtSign] Field exp should be of type number')
    )
  })

  it("Should fail when incorrect 'alg' field", function () {
    assert.throws(
      () => lib.jwtSign(JWK_KEY, JWT_PAYLOAD, {}, 200, 89),
      expectError('Error', '[jwtSign] unsupported alg name: 89')
    )
  })
})
