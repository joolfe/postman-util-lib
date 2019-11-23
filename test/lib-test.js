'use strict'

const { describe } = require('mocha')

describe('Postman Library unit test', function () {
  require('./jwtSign')
  require('./jwtVerify')
  require('./clientAssertPrivateKey')
  require('./clientAssertSecret')
  require('./pkceChallenge')
  require('./sha256')
  require('./it-server')
})
