'use strict'

const lib = require('../src/lib')
const { describe, it } = require('mocha')
const jsonwebtoken = require('jsonwebtoken')
const assert = require('assert')

const { CLIENT_ID, AUD, SECRET, expectError } = require('./test-helpers')

describe('clientAssertSecret()', function () {
  it("Should generate 'client_secret_jwt' assertion correctly with deault values", function () {
    const jwt = lib.clientAssertSecret(SECRET, CLIENT_ID, AUD)
    const decodeJwt = jsonwebtoken.verify(jwt, SECRET)
    assert.strictEqual(decodeJwt.client_id, CLIENT_ID)
    assert.strictEqual(decodeJwt.iss, CLIENT_ID)
    assert.strictEqual(decodeJwt.aud, AUD)
    assert(decodeJwt.iat)
    assert(decodeJwt.nbf)
    assert(decodeJwt.exp)
    assert(decodeJwt.jti)
  })

  it('Should not add kid', function () {
    const jwt = lib.clientAssertSecret(SECRET, CLIENT_ID, AUD)
    const decodeJwt = jsonwebtoken.decode(jwt, { complete: true })
    assert(decodeJwt.header.kid === undefined)
  })

  it('Should fail when no secret provided', function () {
    assert.throws(
      () => lib.clientAssertSecret(null, CLIENT_ID, AUD),
      expectError('Error', '[clientAssertSecret] Field secret should be of type string')
    )
  })

  it('Should fail when incorrect secret provided', function () {
    assert.throws(
      () => lib.clientAssertSecret(3763763, CLIENT_ID, AUD),
      expectError('Error', '[clientAssertSecret] Field secret should be of type string')
    )
  })
})
