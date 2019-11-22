'use strict'

const assert = require('assert')
const crypto = require('crypto')
const lib = require('../src/lib')
const { describe, it } = require('mocha')
const { encodeBuffer } = require('./test-helpers')

describe('pkceChallenge()', function () {
  it('Should generate a challenge correctly', function () {
    const pkce = lib.pkceChallenge()
    let expected = pkce.code_verifier
    expected = encodeBuffer(crypto.createHash('sha256').update(expected).digest())
    assert.strictEqual(pkce.code_challenge, expected)
  })
})
