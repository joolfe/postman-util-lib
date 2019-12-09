'use strict'

const newman = require('newman')

newman.run({
  collection: require('./postman/pmlib_test_collection.json'),
  reporters: 'cli'
}, function (err) {
  if (err) { throw err }
  console.log('collection run complete!')
})
