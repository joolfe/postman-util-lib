# A crypto utility library for Postman

Postman-util-lib is a javascript library bundle to squeeze Postman script allowing you to easy use lot of cryptography method from `Pre-request Script` and `Tests` tabs in Postman.

## Features

- Setup in less than 5 min.
- Straihg use for JWT sign and validation.
- Openid Connect `client_secret_jwt` and `private_key_jwt` implementation.
- [PCKE](https://tools.ietf.org/html/rfc7636) challenge generation
- All [jsrsasign](http://kjur.github.io/jsrsasign/) methods exposed in the library.

# How to "Install"

Well in fact this is not a installation but to use the library inside Postman you just need to put the library bundle content located here
```
https://joolfe.github.io/postman-util-lib/dist/bundle.js
```
In a Postman global variable, so can be reference from all your Collections/Request.

You have two options:

## Automatic Setup (Recomended)

Just download the [example postman collection](#postman-collection) in your computer and [import the collection](https://learning.getpostman.com/docs/postman/collections/data-formats/#importing-postman-data) into your Postman app, execute the GET request called "Lib install" and thats all! If request respond with a 200 OK the library will be store in a global variable called `pmlib_code` :muscle:

## Manual Setup

If you can't import the [example postman collection](#postman-collection)  or simply you want to do the process by your selfve, don't worry is also very easy :relieved:.

1. Navigate to the [bundle url](https://joolfe.github.io/postman-util-lib/bundle.js) in your web browser and copy the content of the page.
2. In your Postman app open the "Manage Environments" screen clicking in the cogs icon located in the top right corner of the principal postman screen.
3. Once in "MANAGE ENVIRONMENTS" screen click on the "Globals" button. You will see a list of defined globals variables.
4. Create a new variable in the table, choose a name (for example `pmlib_code`) and put in the first column, paste the bundle text in "INITIAL VALUE" column, and save using the button on the bottom.
5. That's all :muscle:

Don't forget the variable name, will be used in the next section about "How to use it" the library.

# How to use it

Postman use a Sandbox to execute the javascript code, this means that you cannot import libraries as usually, the only allowed method is using the function `eval()`, I know I know is not a good practice but is the only way :grimacing:. So to make the library available to be used in a `Pre-request Script` or `Tests` script you just need to do:

```
eval( pm.globals.get('pmlib_code') )
```

The name of the variable that you get from `globals` scopes should be the same as you have choose in the installation step. When execute this code a new variable called `pmlib` will be created and will be available in the scope of the tab where you have execute this code.

> Note: Don't mismatch the variable name where you have put the library code whith the name of the variable created after do the installation, this last name `pmlib` is static inside the library and you cannot change by yourselfe.

Now that library is loaded you can use it just referencing to `pmlib`, for examaple to obtain a PKCE challenge just put this code:

```
const challenge = pmlib.pkceChallenge()
console.log(challenge)
```

If you open the [Postman console](https://learning.getpostman.com/docs/postman/sending-api-requests/debugging-and-logs/) you will see something like this:

![console-log](images/console-log.png)

> You can test exactly this code just using the [example postman collection](#postman-collection) and run the Request called "Lib use example".

# Postman collection 

To use the automatic install method and also for test the library there exist an already ready to use collection in the repo, in this [location](https://github.com/joolfe/postman-util-lib/tree/master/postman), the collection is provided in two verisons:

- Version 2: PostmanUtilityLibv2.postman_collection.json
- Version 2.1: PostmanUtilityLibv21.postman_collection.json

# Available Methods



# Common Receipts

