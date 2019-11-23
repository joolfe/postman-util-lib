'use strict'

const server = require('./src/builtin-server.js')

var port = process.env.PORT || 9090

server.listen(port, function () {
  console.log('Server running on port %d', port)
})
