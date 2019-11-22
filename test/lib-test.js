'use strict'

const lib = require('../src/lib.js')
const { describe, it } = require('mocha')
const assert = require('assert')
const crypto = require('crypto')
const fs = require('fs')
// We use another library to test just to be sure our code works
const jsonwebtoken = require('jsonwebtoken')

const jwkKey = require('./resources/jwk.json')
const jwkPubKey = require('./resources/jwkPublic.json')
const pemPubKey = fs.readFileSync('./test/resources/publicKey.pem')

const fromBase64 = (base64) => base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
const encodeBuffer = (buf) => fromBase64(buf.toString('base64'))

describe('Postman Library unit test', function () {
  describe('pkceChallenge()', function () {
    it('Should generate a challenge correctly', function () {
      const pkce = lib.pkceChallenge()
      let expected = pkce.code_verifier
      expected = encodeBuffer(crypto.createHash('sha256').update(expected).digest())
      assert.strictEqual(pkce.code_challenge, expected)
    })
  })

  describe('jwtSign()', function () {
    it('Should fail when no jwk provided', function () {
      assert.throws(
        () => {
          lib.jwtSign(undefined, {
            client_id: 'bb2d95df-ae2e-4f22-a6ab-958d3591f1cf',
            iss: 'bb2d95df-ae2e-4f22-a6ab-958d3591f1cf',
            aud: 'http://audience.test.com'
          })
        },
        {
          name: 'Error',
          message: 'jwtSign: jwt param is mandatory'
        }
      )
    })

    it("Should fail when jwk don't have the correct format", function () {
      assert.throws(
        () => {
          lib.jwtSign('{ "hi": "hi"}', {
            client_id: 'bb2d95df-ae2e-4f22-a6ab-958d3591f1cf',
            iss: 'bb2d95df-ae2e-4f22-a6ab-958d3591f1cf',
            aud: 'http://audience.test.com'
          })
        },
        /^not supported argument$/
      )
    })

    it("Should fail when jwk don't have a private key", function () {
      assert.throws(
        () => {
          lib.jwtSign(jwkPubKey, {
            client_id: 'bb2d95df-ae2e-4f22-a6ab-958d3591f1cf',
            iss: 'bb2d95df-ae2e-4f22-a6ab-958d3591f1cf',
            aud: 'http://audience.test.com'
          })
        },
        {
          name: 'Error',
          message: 'jwtSign: jwt param should contain a private key'
        }
      )
    })

    it('Should generate signed jwt correctly', function () {
      const jwt = lib.jwtSign(jwkKey, {
        client_id: 'bb2d95df-ae2e-4f22-a6ab-958d3591f1cf',
        iss: 'bb2d95df-ae2e-4f22-a6ab-958d3591f1cf',
        aud: 'http://audience.test.com'
      })
      const decodeJwt = jsonwebtoken.verify(jwt, pemPubKey)
      assert.strictEqual(decodeJwt.client_id, 'bb2d95df-ae2e-4f22-a6ab-958d3591f1cf')
      assert.strictEqual(decodeJwt.iss, 'bb2d95df-ae2e-4f22-a6ab-958d3591f1cf')
      assert.strictEqual(decodeJwt.aud, 'http://audience.test.com')
      assert(decodeJwt.iat)
      assert(decodeJwt.nbf)
      assert(decodeJwt.exp)
      assert(decodeJwt.jti)
    })
  })

  describe('clientAssertionJwt()', function () {
    it("Should generate 'private_key_jwt' assertion correctly", function () {
      const jwt = lib.clientAssertionJwt(jwkKey, 'bb2d95df-ae2e-4f22-a6ab-958d3591f1cf', 'http://audience.test.com')
      const decodeJwt = jsonwebtoken.verify(jwt, pemPubKey)
      assert.strictEqual(decodeJwt.client_id, 'bb2d95df-ae2e-4f22-a6ab-958d3591f1cf')
      assert.strictEqual(decodeJwt.iss, 'bb2d95df-ae2e-4f22-a6ab-958d3591f1cf')
      assert.strictEqual(decodeJwt.aud, 'http://audience.test.com')
      assert(decodeJwt.iat)
      assert(decodeJwt.nbf)
      assert(decodeJwt.exp)
      assert(decodeJwt.jti)
    })
  })

  describe('sha256()', function () {
    it("Should generate a 'sha256' hash correctly", function () {
      const sha256result = lib.sha256('justastringtest')
      assert.strictEqual(sha256result, 'bada5cf2975ed1eec9ac725316a8299dfa4d19bc2f2816644ba3bd2b99f0f0a1')
    })
  })
})
