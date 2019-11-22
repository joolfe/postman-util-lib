'use strict'

const lib = require('../src/lib.js')
const { describe, it } = require('mocha')
const assert = require('assert')
const crypto = require('crypto')
const jwkKey = require('./resources/jwk.json')
const jwkKeyPub = require('./resources/jwkPublic.json')

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
          lib.jwtSign(undefined, 3000, 'RS256', {
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

    it('Should fail when jwk dont have the correct format', function () {
      assert.throws(
        () => {
          lib.jwtSign('{ "hi": "hi"}', 3000, 'RS256', {
            client_id: 'bb2d95df-ae2e-4f22-a6ab-958d3591f1cf',
            iss: 'bb2d95df-ae2e-4f22-a6ab-958d3591f1cf',
            aud: 'http://audience.test.com'
          })
        },
        /^not supported argument$/
      )
    })

    it('Should fail when jwk dont have a private key', function () {
      assert.throws(
        () => {
          lib.jwtSign(jwkKeyPub, 3000, 'RS256', {
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
      const jwt = lib.jwtSign(jwkKey, 3000, 'RS256', {
        client_id: 'bb2d95df-ae2e-4f22-a6ab-958d3591f1cf',
        iss: 'bb2d95df-ae2e-4f22-a6ab-958d3591f1cf',
        aud: 'http://audience.test.com'
      })
    })
  })
})
