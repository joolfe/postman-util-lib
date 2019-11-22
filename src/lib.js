'use strict'

const rs = require('jsrsasign')
const nanoid = require('nanoid/non-secure')

function validate (assertion, msg) {
  if (assertion) { throw new Error(msg) }
}

function pkceChallenge () {
  const randomBytes = rs.crypto.Util.getRandomHexOfNbytes(32)
  const codeVerifier = rs.hextob64u(randomBytes)
  const hashResult = rs.crypto.Util.hashString(codeVerifier, 'sha256')
  const codeChallenge = rs.hextob64u(hashResult)
  return {
    code_verifier: codeVerifier,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256'
  }
}

function jwtSign (jwk, exp = 0, alg = 'RS256', payload = {}, header = {}) {
  validate(!jwk, 'jwtSign: jwt param is mandatory')
  const prvKey = rs.KEYUTIL.getKey(jwk)
  validate(!prvKey.isPrivate, 'jwtSign: jwt param should contain a private key')

  // Calculate time variables
  var currentTime = Math.ceil((new Date()).getTime() / 1000) // the current time in seconds
  var expirationTime = currentTime + exp

  const jwtHeader = Object.assign(header, { typ: 'JWT', alg })

  const jwtBody = Object.assign(payload,
    {
      iat: currentTime - 5,
      nbf: currentTime - 5,
      exp: expirationTime,
      jti: nanoid()
    })

  const sHeader = JSON.stringify(jwtHeader)
  const sPayload = JSON.stringify(jwtBody)

  return rs.jws.JWS.sign(alg, sHeader, sPayload, prvKey)
}

function jwtVerify (jwt, jwk) {

}

function sha256 (string) {

}

module.exports = {
  pkceChallenge,
  jwtSign,
  jwtVerify,
  sha256
}
