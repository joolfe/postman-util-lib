'use strict'

const assert = require('assert')
const lib = require('../src/lib')
const { describe, it } = require('mocha')
const {
  JWT_PAYLOAD, expectError, JWT_INVALID, JWK_KEY, CLIENT_ID,
  AUD, PEM_PUB_KEY, JWT_EXPIRED
} = require('./test-helpers')

describe('jwtVerify()', function () {
  it('Should return a parsed JWT when valid', function () {
    const jwt = lib.jwtSign(JWK_KEY, JWT_PAYLOAD)
    const decodedJWT = lib.jwtVerify(jwt, PEM_PUB_KEY)
    assert(decodedJWT.payload)
    assert(decodedJWT.header)
    assert.strictEqual(decodedJWT.payload.client_id, CLIENT_ID)
    assert.strictEqual(decodedJWT.payload.iss, CLIENT_ID)
    assert.strictEqual(decodedJWT.payload.aud, AUD)
  })

  it('Should fail when no jwt passed', function () {
    assert.throws(
      () => { lib.jwtVerify(undefined, PEM_PUB_KEY) },
      expectError('Error', 'jwtVerify: jwt param is mandatory and should be a jwt in string format')
    )
  })

  it('Should fail when no pubkey passed', function () {
    assert.throws(
      () => { lib.jwtVerify('Notvalidated') },
      expectError('Error', 'jwtVerify: pubkey param is mandatory and should be a PEM string.')
    )
  })

  it('Should fail when jwt is not a string', function () {
    assert.throws(
      () => { lib.jwtVerify(234567, PEM_PUB_KEY) },
      expectError('Error', 'jwtVerify: jwt param is mandatory and should be a jwt in string format')
    )
  })

  it('Should fail when pubkey is not a string', function () {
    assert.throws(
      () => { lib.jwtVerify('Notvalidated', 2763763763) },
      expectError('Error', 'jwtVerify: pubkey param is mandatory and should be a PEM string.')
    )
  })

  it('Should fail when expired jwt', function () {
    assert.throws(
      () => { lib.jwtVerify(JWT_EXPIRED, PEM_PUB_KEY) },
      expectError('Error', 'jwtVerify: Invalid JWT')
    )
  })

  it('Should fail when not valid signature jwt', function () {
    assert.throws(
      () => { lib.jwtVerify(JWT_INVALID, PEM_PUB_KEY) },
      expectError('Error', 'jwtVerify: Invalid JWT')
    )
  })

  it('Should validate with not default alg', function () {
    const jwt = lib.jwtSign(JWK_KEY, JWT_PAYLOAD, {}, 3000, 'RS384')
    const decodedJWT = lib.jwtVerify(jwt, PEM_PUB_KEY, 'RS384')
    assert(decodedJWT.payload)
    assert(decodedJWT.header)
    assert.strictEqual(decodedJWT.payload.client_id, CLIENT_ID)
    assert.strictEqual(decodedJWT.payload.iss, CLIENT_ID)
    assert.strictEqual(decodedJWT.payload.aud, AUD)
  })
})
