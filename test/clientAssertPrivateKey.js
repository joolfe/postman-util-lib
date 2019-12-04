'use strict'

const lib = require('../src/lib')
const { describe, it } = require('mocha')
const jsonwebtoken = require('jsonwebtoken')
const assert = require('assert')

const { CLIENT_ID, AUD, JWK_KEY, PEM_PUB_KEY, expectError } = require('./test-helpers')

describe('clientAssertPrivateKey()', function () {
  it("Should generate 'private_key_jwt' assertion correctly with deafult values", function () {
    const jwt = lib.clientAssertPrivateKey(JWK_KEY, CLIENT_ID, AUD)
    const decodeJwt = jsonwebtoken.verify(jwt, PEM_PUB_KEY)
    assert.strictEqual(decodeJwt.sub, CLIENT_ID)
    assert.strictEqual(decodeJwt.iss, CLIENT_ID)
    assert.strictEqual(decodeJwt.aud, AUD)
    assert(decodeJwt.iat)
    assert(decodeJwt.nbf)
    assert(decodeJwt.exp)
    assert(decodeJwt.jti)
  })

  it('Should add kid to header', function () {
    const jwt = lib.clientAssertPrivateKey(JWK_KEY, CLIENT_ID, AUD)
    const decodeJwt = jsonwebtoken.decode(jwt, { complete: true })
    assert.strictEqual(decodeJwt.header.kid, JWK_KEY.kid)
  })

  it("Should generate 'private_key_jwt' assertion correctly with custom values", function () {
    const jwt = lib.clientAssertPrivateKey(JWK_KEY, CLIENT_ID, AUD, 3600, 'RS384')
    const decodeJwt = jsonwebtoken.verify(jwt, PEM_PUB_KEY)
    assert.strictEqual(decodeJwt.sub, CLIENT_ID)
    assert.strictEqual(decodeJwt.iss, CLIENT_ID)
    assert.strictEqual(decodeJwt.aud, AUD)
    assert(decodeJwt.iat)
    assert(decodeJwt.nbf)
    assert(decodeJwt.exp)
    assert(decodeJwt.jti)
  })

  it('Should work validations', function () {
    assert.throws(
      () => lib.clientAssertPrivateKey(null, CLIENT_ID, AUD),
      expectError('Error', '[jwtSign] Field jwk should be of type string,object')
    )
  })
})
