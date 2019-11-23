'use strict'

const rs = require('jsrsasign')
const nanoid = require('nanoid/non-secure')
const { valStringOrObject, valString, valObject, valNumber } = require('./validate.js')

const SHA256 = 'sha256'
const DEFAULT_ALG = 'RS256'
const DEFAULT_ALG_H = 'HS256'

/**
 * create JWS with the provided data
 * @param {*} secret A key object or sectret to sign the jwt
 * @param {*} payload The jwt payload fields
 * @param {*} header Additional headers fields for jwt
 * @param {*} exp The expiration time in seconds, default value 10min (600seg)
 * @param {*} alg The algorithm used to sign the jwt, default value 'RS256'
 */
function createJws (secret, payload, header, exp, alg) {
  valObject(payload, 'payload')
  valObject(header, 'header')
  valNumber(exp, 'exp')

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

  return rs.jws.JWS.sign(alg, sHeader, sPayload, secret)
}

/**
 * Generate a PKCE as described in specification https://tools.ietf.org/html/rfc7636
 * return an object with a code_verifier, code_challenge and code_challenge_method
 */
function pkceChallenge () {
  const randomBytes = rs.crypto.Util.getRandomHexOfNbytes(32)
  const codeVerifier = rs.hextob64u(randomBytes)
  const hashResult = rs.crypto.Util.hashString(codeVerifier, SHA256)
  const codeChallenge = rs.hextob64u(hashResult)
  return {
    code_verifier: codeVerifier,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256'
  }
}

/**
 * Create and sign a JWT with the provided data
 * @param {*} jwk A jwk key to sign the jwt
 * @param {*} payload The jwt payload fields
 * @param {*} header Additional headers fields for jwt
 * @param {*} exp The expiration time in seconds, default value 10min (600seg)
 * @param {*} alg The algorithm used to sign the jwt, default value 'RS256'
 */
function jwtSign (jwk = '', payload = {}, header = {}, exp = 600, alg = DEFAULT_ALG) {
  try {
    valStringOrObject(jwk, 'jwk')
    const prvKey = rs.KEYUTIL.getKey(jwk)
    return createJws(prvKey, payload, header, exp, alg)
  } catch (err) {
    const msg = (typeof err === 'string') ? err : err.message
    throw new Error(`[jwtSign] ${msg}`)
  }
}

/**
 * Verify that jwt is valid (time) and correctly signed and return the parsed value,
 * in case of not valid will throw and Error.
 * @param {*} jwt The string jwt to be verified.
 * @param {*} pubkey Public key string to verify the signature. (Pem format)
 * @param {*} algorithm Jwt should be signed with this algorithm. Default value 'RS256'
 */
function jwtVerify (jwt, pubkey, algorithm = DEFAULT_ALG) {
  try {
    valString(jwt, 'jwt')
    valString(pubkey, 'pubkey')
    const publicKey = rs.KEYUTIL.getKey(pubkey)
    const valid = rs.jws.JWS.verifyJWT(jwt, publicKey, {
      alg: [algorithm],
      gracePeriod: 5
    })
    if (!valid) { throw new Error('Invalid JWT') }
    const parsed = rs.jws.JWS.parse(jwt)
    return {
      header: parsed.headerObj,
      payload: parsed.payloadObj
    }
  } catch (err) {
    throw new Error(`[jwtVerify] ${err.message}`)
  }
}

/**
 * Return the hash of the passed value in sha256
 * @param {*} string Value to be hashed
 */
function sha256 (string) {
  return rs.crypto.Util.hashString(string, SHA256)
}

/**
 * Generate a signed jwt for use 'private_key_jwt' client authentication as describe in Section 9 of
 * OIDC https://openid.net/specs/openid-connect-core-1_0.html
 * @param {*} jwk A jwk key to sign the jwt
 * @param {*} clientID The client_id of the OAuth Client.
 * @param {*} aud The aud (audience) Claim. Value that identifies the Authorization Server as an intended audience.
 * @param {*} exp The expiration time in seconds, default value 10min (600seg)
 * @param {*} alg The algorithm used to sign the jwt, default value 'RS256'
 */
function clientAssertPrivateKey (jwk, clientID, aud, exp = 600, alg = DEFAULT_ALG) {
  return jwtSign(jwk, {
    client_id: clientID,
    iss: clientID,
    aud: aud
  }, {}, exp, alg)
}

/**
 * Generate a signed jwt for use 'client_secret_jwt' client authentication as describe in Section 9 of
 * OIDC https://openid.net/specs/openid-connect-core-1_0.html 
 * @param {*} secret A client secret to sign the JWT
 * @param {*} clientID The client_id of the OAuth Client.
 * @param {*} aud The aud (audience) Claim. Value that identifies the Authorization Server as an intended audience.
 * @param {*} exp The expiration time in seconds, default value 10min (600seg)
 * @param {*} alg The algorithm used to sign the jwt, default value 'HS256'
 */
function clientAssertSecret (secret, clientID, aud, exp = 600, alg = DEFAULT_ALG_H) {
  try {
    valString(secret, 'secret')
    return createJws(secret, {
      client_id: clientID,
      iss: clientID,
      aud: aud
    }, {}, exp, alg)
  } catch (err) {
    throw new Error(`[clientAssertSecret] ${err.message}`)
  }
}

module.exports = {
  pkceChallenge,
  jwtSign,
  jwtVerify,
  sha256,
  clientAssertPrivateKey,
  clientAssertSecret
}
