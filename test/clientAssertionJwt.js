'use strict'

const lib = require('../src/lib')
const { describe, it } = require('mocha')
const jsonwebtoken = require('jsonwebtoken')
const assert = require('assert')

const { CLIENT_ID, AUD, JWK_KEY, PEM_PUB_KEY } = require('./test-helpers')

describe('clientAssertionJwt()', function () {
  it("Should generate 'private_key_jwt' assertion correctly", function () {
    const jwt = lib.clientAssertionJwt(JWK_KEY, CLIENT_ID, AUD)
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
