'use strict'

const fs = require('fs')

const JWK_KEY = require('./resources/jwk.json')
const JWK_PUBLIC_KEY = require('./resources/jwkPublic.json')
const PEM_PUB_KEY = fs.readFileSync('./test/resources/publicKey.pem', 'utf8')

const CLIENT_ID = 'bb2d95df-ae2e-4f22-a6ab-958d3591f1cf'
const AUD = 'http://audience.test.com'
const JWT_EXPIRED = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJjbGllbnRfaWQiOiJiYjJkOTVkZi1hZTJlLTRmMjItYTZhYi05NThkMzU5MWYxY2YiLCJpc3MiOiJiYjJkOTVkZi1hZTJlLTRmMjItYTZhYi05NThkMzU5MWYxY2YiLCJhdWQiOiJodHRwOi8vYXVkaWVuY2UudGVzdC5jb20iLCJpYXQiOjE1NzQ0Mzc5NTEsIm5iZiI6MTU3NDQzNzk1MSwiZXhwIjoxNTc0NDM4NTU2LCJqdGkiOiIxZ3NBcnlBUDNDbExmdGFac1h3OFMifQ.L9cAI8CYmQ_Yig9M7axJHzzomscloXBoBOn1vB705JYjQ9nOQpOMFh5a3mKWQGQ5sRvkhtI1AeILPPYxTiD5IcqdIHEJW-_hHAWJt71mP4GITgUCFV-oFTMKqy3AyB6DgT_nf-h9PzA1M2WewcYQ1IF5AROyW7pT-aISz7iRAo2bgRcAB6rc7mdDb_WHkE9sUHy1hp5UuNuqkh-JkUC7T9PTIEw5OUmbyZ7WAPlVLolyVKQDvRSkfbzOxqJFYKySOmickkg_tWECrgIQ40PvLjMd5_bbwM71UHf-AC2PW1cHJUk7-wwvkYPh59Qs56H7vCprw3P02REfE0_ARVFTQg'
const JWT_INVALID = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJjbGllbnRfaWQiOiJiYjJkOTVkZi1hZTJlLTRmMjItYTZhYi05NThkMzU5MWYxY2YiLCJpc3MiOiJiYjJkOTVkZi1hZTJlLTRmMjItYTZhYi05NThkMzU5MWYxY2YiLCJhdWQiOiJodHRwOi8vYXVkaWVuY2UudGVzdC5jb20iLCJpYXQiOjE1NzQ0Mzc5NTEsIm5iZiI6MTU3NDQzNzk1MSwiZXhwIjoxNTc0NDM4NTU2LCJqdGkiOiIxZ3NBcnlBUDNDbExmdGFac1h3OFMifQ.L9cAI8CYmQ_Yig9M7axJHzzomscloXBoBOn1vB705JYjQ9nOQpOMFh5a3mKWQGQ5sRvkhtI1AeILPPYxTiD5IcqdIHEJW-_hHAWJt71mP4GITgUCFV-oFTMKqy3AyB6DgT_nf-h9PzA1M2WewcYQ1IF5AROyW7pT-aISz7iRAo2bgRcAB6rc7mdDb_WHkE9sUHy1hp5UuNuqkh-JkUC7T9PTIEw5OUmbyZ7WAPlVLolyVKQDvRSkfbzOxqJFYKySOmickkg_tWECrgIQ40PvLjMd5_bbwM71UHf-AC2PW1cHJUk7-wwvkYPh59Qs56H7vCprw3P02REfE0_AR'
const JWT_PAYLOAD = {
  client_id: CLIENT_ID,
  iss: CLIENT_ID,
  aud: AUD
}

function expectError (name, message) {
  return { name, message }
}

function fromBase64 (base64) {
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function encodeBuffer (buf) {
  return fromBase64(buf.toString('base64'))
}

module.exports = {
  CLIENT_ID,
  AUD,
  JWT_EXPIRED,
  JWT_INVALID,
  JWT_PAYLOAD,
  JWK_KEY,
  JWK_PUBLIC_KEY,
  PEM_PUB_KEY,
  expectError,
  encodeBuffer
}
