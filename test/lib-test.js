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
const pemPubKey = fs.readFileSync('./test/resources/publicKey.pem', 'utf8')

const { JWT_EXPIRED, JWT_INVALID, CLIENT_ID, AUD } = require('./resources/test-data.json')

const fromBase64 = (base64) => base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
const encodeBuffer = (buf) => fromBase64(buf.toString('base64'))
const error = (name, message) => { return { name, message } }

describe('Postman Library unit test', function () {
  const JWT_PAYLOAD = {
    client_id: CLIENT_ID,
    iss: CLIENT_ID,
    aud: AUD
  }

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
        () => { lib.jwtSign(undefined, JWT_PAYLOAD) },
        error('Error', 'jwtSign: jwt param is mandatory')
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
          lib.jwtSign(jwkPubKey, JWT_PAYLOAD)
        },
        error('Error', 'jwtSign: jwt param should contain a private key')
      )
    })

    it('Should generate signed jwt correctly', function () {
      const jwt = lib.jwtSign(jwkKey, JWT_PAYLOAD)
      const decodeJwt = jsonwebtoken.verify(jwt, pemPubKey)
      assert.strictEqual(decodeJwt.client_id, CLIENT_ID)
      assert.strictEqual(decodeJwt.iss, CLIENT_ID)
      assert.strictEqual(decodeJwt.aud, AUD)
      assert(decodeJwt.iat)
      assert(decodeJwt.nbf)
      assert(decodeJwt.exp)
      assert(decodeJwt.jti)
    })
  })

  describe('clientAssertionJwt()', function () {
    it("Should generate 'private_key_jwt' assertion correctly", function () {
      const jwt = lib.clientAssertionJwt(jwkKey, CLIENT_ID, AUD)
      const decodeJwt = jsonwebtoken.verify(jwt, pemPubKey)
      assert.strictEqual(decodeJwt.client_id, CLIENT_ID)
      assert.strictEqual(decodeJwt.iss, CLIENT_ID)
      assert.strictEqual(decodeJwt.aud, AUD)
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

  describe('jwtVerify()', function () {
    it('Should return a parsed JWT when valid', function () {
      const jwt = lib.jwtSign(jwkKey, JWT_PAYLOAD)
      const decodedJWT = lib.jwtVerify(jwt, pemPubKey)
      assert(decodedJWT.payload)
      assert(decodedJWT.header)
      assert.strictEqual(decodedJWT.payload.client_id, CLIENT_ID)
      assert.strictEqual(decodedJWT.payload.iss, CLIENT_ID)
      assert.strictEqual(decodedJWT.payload.aud, AUD)
    })

    it('Should fail when no jwt passed', function () {
      assert.throws(
        () => { lib.jwtVerify(undefined, pemPubKey) },
        error('Error', 'jwtVerify: jwt param is mandatory and should be a jwt in string format')
      )
    })

    it('Should fail when no pubkey passed', function () {
      assert.throws(
        () => { lib.jwtVerify('Notvalidated') },
        error('Error', 'jwtVerify: pubkey param is mandatory and should be a PEM string.')
      )
    })

    it('Should fail when jwt is not a string', function () {
      assert.throws(
        () => { lib.jwtVerify(234567, pemPubKey) },
        error('Error', 'jwtVerify: jwt param is mandatory and should be a jwt in string format')
      )
    })

    it('Should fail when pubkey is not a string', function () {
      assert.throws(
        () => { lib.jwtVerify('Notvalidated', 2763763763) },
        error('Error', 'jwtVerify: pubkey param is mandatory and should be a PEM string.')
      )
    })

    it('Should fail when expired jwt', function () {
      assert.throws(
        () => { lib.jwtVerify(JWT_EXPIRED, pemPubKey) },
        error('Error', 'jwtVerify: Invalid JWT')
      )
    })

    it('Should fail when not valid signature jwt', function () {
      assert.throws(
        () => { lib.jwtVerify(JWT_INVALID, pemPubKey) },
        error('Error', 'jwtVerify: Invalid JWT')
      )
    })

    it('Should validate with not default alg', function () {
      const jwt = lib.jwtSign(jwkKey, JWT_PAYLOAD, {}, 3000, 'RS384')
      const decodedJWT = lib.jwtVerify(jwt, pemPubKey, 'RS384')
      assert(decodedJWT.payload)
      assert(decodedJWT.header)
      assert.strictEqual(decodedJWT.payload.client_id, CLIENT_ID)
      assert.strictEqual(decodedJWT.payload.iss, CLIENT_ID)
      assert.strictEqual(decodedJWT.payload.aud, AUD)
    })
  })
})
