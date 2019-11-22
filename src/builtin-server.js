'use strict'

const http = require('http')
const fs = require('fs')
const path = require('path')

const port = 9090
const bundlePath = path.join(__dirname, '../dist/bundle.js')

http.createServer(function (req, res) {
  console.log('request starting...')
  fs.readFile(bundlePath, (err, data) => {
    if (err) {
      res.statusCode = 500
      res.end(err.message)
      console.error(err)
    } else {
      res.setHeader('Content-type', 'application/javascript; charset=utf-8')
      res.end(data)
      console.error(`Correctly served file ${bundlePath}`)
    }
  })
}).listen(port, () => {
  console.log(`Dev server running in port ${port} ...`)
})
