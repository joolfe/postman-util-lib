<div class="tilted-section"><div markdown="1">

# A crypto utility library for Postman

Postman-util-lib is a JavaScript library bundle to squeeze Postman script allowing you to easy use lot of cryptography method from `Pre-request Script` and `Tests` tabs in Postman.

![postman](https://img.shields.io/github/workflow/status/joolfe/postman-util-lib/Node%20CI?&label=Build&logo=github&style=flat-square)
![postman](https://img.shields.io/badge/Postman-%3E=7.0.9-green?logo=postman&style=flat-square&color=FF6C37)

## Features

- Setup in less than 5 min.
- Straight use for JWT signature and validation.
- OpenID Connect `client_secret_jwt` and `private_key_jwt` implementation.
- [PCKE](https://tools.ietf.org/html/rfc7636) challenge generation
- All [jsrsasign](http://kjur.github.io/jsrsasign/) methods exposed in the library.

</div></div>
<div class="tilted-section"><div markdown="1">

# Installation

Well in fact this is not a installation but to use the library inside Postman you just need to put the library bundle content located here
```
https://joolfe.github.io/postman-util-lib/dist/bundle.js
```
In a Postman global variable, so can be reference from all your Collections/Request.

You have two options:

## Automatic Setup (Recommended)

Just download the [example postman collection](#postman-collection) in your computer and [import the collection](https://learning.getpostman.com/docs/postman/collections/data-formats/#importing-postman-data) into your Postman app, execute the GET request called "Lib install" and that’s all! If request respond with a 200 OK the library will be store in a global variable called `pmlib_code` :muscle:

## Manual Setup

If you can't import the [example postman collection](#postman-collection)  or simply you want to do the process by your selve, don't worry is also very easy :relieved:.

1. Navigate to the [bundle url](https://joolfe.github.io/postman-util-lib/bundle.js) in your web browser and copy the content of the page.
2. In your Postman app open the "Manage Environments" screen clicking in the cogs icon located in the top right corner of the principal postman screen.
3. Once in "MANAGE ENVIRONMENTS" screen click on the "Globals" button. You will see a list of defined global variables.
4. Create a new variable in the table, choose a name (for example `pmlib_code`) and put in the first column, paste the bundle text in "INITIAL VALUE" column, and save using the button on the bottom.
5. That's all :muscle:

Don't forget the variable name, will be used in the next section about "How to use it" the library.

</div></div>
<div class="tilted-section"><div markdown="1">

# Usage

Postman use a Sandbox to execute the JavaScript code, this means that you cannot import libraries as usually, the only allowed method is using the function `eval()`, I know I know is not a good practice but is the only way :grimacing:. So to make the library available to be used in a `Pre-request Script` or `Tests` script you just need to do:

```javascript
eval( pm.globals.get('pmlib_code') )
```

The name of the variable that you get from `globals` scopes should be the same as you have choose in the installation step. When execute this code a new variable called `pmlib` will be created and will be available in the scope of the tab where you have execute this code.

> Note: Don't mismatch the variable name where you have put the library code with the name of the variable created after do the installation, this last name `pmlib` is static inside the library and you cannot change by yourself.

Now that library is loaded you can use it just referencing to `pmlib`, for example to obtain a PKCE challenge just put this code:

```javascript
const challenge = pmlib.pkceChallenge()
console.log(challenge)
```

If you open the [Postman console](https://learning.getpostman.com/docs/postman/sending-api-requests/debugging-and-logs/) you will see something like this:

![console-log](images/console-log.png)

> You can test exactly this code just using the [example postman collection](#postman-collection) and run the Request called "Lib use example".

## Available Methods

### pmlib.pkceChallenge()

Generate a "S256" Proof Key for Code Exchange (PKCE) as described in [RFC7636](https://tools.ietf.org/html/rfc7636), return an object like:
```javascript
{
    code_challenge: "JT4SVOGg1mUhv8QNz3_PIYdgEJxy6tUyx9qAR_GWbPE"
    code_challenge_method: "S256"
    code_verifier: "ATT6CIewaFJnsachPeUfqD-5r7xj4g5MHE0qvDDP2T4"
}
```

### pmlib.jwtSign(jwk = '', payload = {}, header = {}, exp = 600, alg = DEFAULT_ALG)

Create and sign a [JWT](https://tools.ietf.org/html/rfc7519) with the provided data

* **jwk:** (Object, String) A jwk key to sign the jwt
* **payload:** (Object) The jwt payload claims.
* **header:** (Object) The jwt additional headers claims.
* **exp:** (Number) The expiration time in seconds, default value 10min (600seg)
* **alg:** (String) The algorithm used to sign the jwt, default value 'RS256'

### pmlib.jwtVerify(jwt, pubkey, algorithm = DEFAULT_ALG)

Verify that a [JWT](https://tools.ietf.org/html/rfc7519) is valid (time) and correctly signed and return the parsed value,
in case of not valid jwt the method will throw and Error.

* **jwt:** (String) The jwt in string format to be verified.
* **pubkey:** (String) Public key string to verify the signature. (Pem format)
* **algorithm:** (String) Jwt should be signed with this algorithm. Default value 'RS256'

In case of success the method returns an object like:
```javascript
{
    header: {
        alg: "RS256"
        typ: "JWT"
    },
    payload: {
        aud: "http://audience.test.com"
        client_id: "bb2d95df-ae2e-4f22-a6ab-958d3591f1cf"
        exp: 4574525775
        iat: 1574525770
        iss: "bb2d95df-ae2e-4f22-a6ab-958d3591f1cf"
        jti: "NlkcfrbJwSvZrvtFDVrjP"
        nbf: 1574525770
    }
}
```

### pmlib.sha256(string)

Return the hash of the passed value in sha256

* **string:** (String) The value to be hashed to sha256.

### pmlib.clientAssertPrivateKey(jwk, clientID, aud, exp = 600, alg = DEFAULT_ALG)

Generate a signed jwt for use 'private_key_jwt' client authentication as describe in [Section 9 of OIDC](https://openid.net/specs/openid-connect-core-1_0.html)

* **jwk:** (String, Object) A jwk key to sign the jwt
* **clientID:** (String) The client_id of the OAuth Client.
* **aud:** (String) The aud (audience) Claim. Value that identifies the Authorization Server as an intended audience.
* **exp:** (Number) The expiration time in seconds, default value 10min (600seg)
* **alg:** (String) The algorithm used to sign the jwt, default value 'RS256'

### pmlib.clientAssertSecret(secret, clientID, aud, exp = 600, alg = DEFAULT_ALG_H)

Generate a signed jwt for use 'client_secret_jwt' client authentication as describe in [Section 9 of OIDC](https://openid.net/specs/openid-connect-core-1_0.html)

* **secret:** (String) A client secret to sign the JWT
* **clientID:** (String) The client_id of the OAuth Client.
* **aud:** (String) The aud (audience) Claim. Value that identifies the Authorization Server as an intended audience.
* **exp:** (Number) The expiration time in seconds, default value 10min (600seg)
* **alg:** (String) The algorithm used to sign the jwt, default value 'RS256'

### pmlib.rs.*

The library expose all the method of [jsrsasign](http://kjur.github.io/jsrsasign/) in the object `rs`, so you can use all the method described in the [API documentation](https://kjur.github.io/jsrsasign/api/).

For example:
```javascript
const base64String = pmlib.rs.stob64u('My amazing string')
```

</div></div>
<div class="tilted-section"><div markdown="1">

# Postman collection

To use the automatic install method and also for test the library there exist a ready to use collection in the repo, in this [location](https://github.com/joolfe/postman-util-lib/tree/master/postman), you just need to download and [import](https://learning.getpostman.com/docs/postman/collections/data-formats/#importing-postman-data).

The collection is provided in two Postman versions:

- **Version 2:** PostmanUtilityLibv2.postman_collection.json
- **Version 2.1:** PostmanUtilityLibv21.postman_collection.json

Inside the collection you will find the next requests:

- *Lib install:* A GET request to download the library source and put into a global variable. Is the automatic installation.
- *Lib use example:* In the "script" tabs you will find examples about how to use the library.

</div></div>