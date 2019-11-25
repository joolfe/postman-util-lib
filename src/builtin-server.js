'use strict'

const http = require('http')
const fs = require('fs')
const path = require('path')

const bundlePath = path.join(__dirname, '../docs/dist/bundle.js')

module.exports = http.createServer(function (req, res) {
  try {
    const data = fs.readFileSync(bundlePath)
    res.setHeader('Content-type', 'application/javascript; charset=utf-8')
    res.end(data)
    console.log(`Correctly served file ${bundlePath}`)
  } catch (err) {
    res.statusCode = 500
    res.end(err.message)
    console.error(err.message)
  }
})
