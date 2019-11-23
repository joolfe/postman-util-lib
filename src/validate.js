'use strict'

function validate (data, name, types) {
  if (!types.includes(typeof data) || data === null) { throw new Error(`Field ${name} should be of type ${types}`) }
}

function valString (data, name) {
  validate(data, name, ['string'])
}

function valStringOrObject (data, name) {
  validate(data, name, ['string', 'object'])
}

function valObject (data, name) {
  validate(data, name, ['object'])
}

function valNumber (data, name) {
  validate(data, name, ['number'])
}

module.exports = {
  validate,
  valString,
  valObject,
  valNumber,
  valStringOrObject
}
