'use strict'

const { describe } = require('mocha')

describe('Postman Library unit test', function () {
  require('./jwtSign')
  require('./jwtVerify')
  require('./clientAssertPrivateKey')
  require('./pkceChallenge')
  require('./sha256')
})
