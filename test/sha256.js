'use strict'

const lib = require('../src/lib')
const { describe, it } = require('mocha')
const assert = require('assert')

describe('sha256()', function () {
  it("Should generate a 'sha256' hash correctly", function () {
    const sha256result = lib.sha256('justastringtest')
    assert.strictEqual(sha256result, 'bada5cf2975ed1eec9ac725316a8299dfa4d19bc2f2816644ba3bd2b99f0f0a1')
  })
})
