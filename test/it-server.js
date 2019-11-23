'use strict'

const { describe, it } = require('mocha')
const request = require('supertest')
const server = require('../src/builtin-server')
const assert = require('assert')
const sinon = require('sinon')
const fs = require('fs')

describe('Integration test', async function () {
  it('Should serve lib in the server', async function () {
    const body = await request(server)
      .get('/')
      .expect('Content-Type', 'application/javascript; charset=utf-8')
      .expect(200)
    assert(body.text.length > 0)
  })

  it('Should fail if any problem readin file', async function () {
    sinon
      .stub(fs, 'readFileSync')
      .throws('Error', "File don't exist")
    const body = await request(server)
      .get('/')
      .expect(500)
    assert.strictEqual(body.text, "File don't exist")
    fs.readFileSync.restore()
  })
})
