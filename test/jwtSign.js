'use strict'

const assert = require('assert')
const lib = require('../src/lib')
const { describe, it } = require('mocha')
const jsonwebtoken = require('jsonwebtoken')
const { JWT_PAYLOAD, expectError, JWK_PUBLIC_KEY, JWK_KEY, CLIENT_ID, AUD, PEM_PUB_KEY } = require('./test-helpers')

describe('jwtSign()', function () {
  it('Should fail when no jwk provided', function () {
    assert.throws(
      () => { lib.jwtSign(undefined, JWT_PAYLOAD) },
      expectError('Error', 'jwtSign: jwt param is mandatory')
    )
  })

  it("Should fail when jwk don't have the correct format", function () {
    assert.throws(
      () => {
        lib.jwtSign('{ "hi": "hi" }', JWT_PAYLOAD)
      },
      /^not supported argument$/
    )
  })

  it("Should fail when jwk don't have a private key", function () {
    assert.throws(
      () => {
        lib.jwtSign(JWK_PUBLIC_KEY, JWT_PAYLOAD)
      },
      expectError('Error', 'jwtSign: jwt param should contain a private key')
    )
  })

  it('Should generate signed jwt correctly', function () {
    const jwt = lib.jwtSign(JWK_KEY, JWT_PAYLOAD)
    const decodeJwt = jsonwebtoken.verify(jwt, PEM_PUB_KEY)
    assert.strictEqual(decodeJwt.client_id, CLIENT_ID)
    assert.strictEqual(decodeJwt.iss, CLIENT_ID)
    assert.strictEqual(decodeJwt.aud, AUD)
    assert(decodeJwt.iat)
    assert(decodeJwt.nbf)
    assert(decodeJwt.exp)
    assert(decodeJwt.jti)
  })
})
