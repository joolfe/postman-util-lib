# A crypto utility library for Postman

Postman-util-lib is a javascript library bundle to squeeze Postman script allowing you to easy use lot of cryptography method from `Pre-request Script` and `Tests` tabs in Postman.

# Features

- Setup in less than 5 min.
- Straig use for JWT sign and validation.
- Openid Connect 'client_secret_jwt' and 'private_key_jwt' implementation.
- All [jsrsasign](http://kjur.github.io/jsrsasign/) features availables.

# How to "Install"

Well in fact this is not a installation... to use the library inside Postman you just need to put the library bundle content located here
```
https://joolfe.github.io/postman-util-lib/bundle.js
```
In a Postman global variable, so can be reference from all your Collections/Request.

You have two options:

## Automatic Setup (Recomended)

Just download the [example postman collection]() in your computer and [import the collection](https://learning.getpostman.com/docs/postman/collections/data-formats/#importing-postman-data) into your Postman app, execute the GET request called "Postman Util Lib" and thats all! If request respond ok the libray is loaded in your Postman :muscle:

## Manual Setup

If you can't import the [example postman collection]() or simply you want to do the process by your selve, don't worry is also very easy :relieved:.

1. Navigate to the [bundle url](https://joolfe.github.io/postman-util-lib/bundle.js) in your web browser and copy the content of the page.
2. In your Postman app open the "Manage Environments" screen clicking in the cogs icon located in the top right corner of the principal postman screen.
3. Once in "MANAGE ENVIRONMENTS" screen click on the "Globals" button. You will see a list of defined globals variables.
4. Create a new variable in the table, choose a name (for example "pmlib") and put in the first column,  paste the bundle text in "INITIAL VALUE" column, and save using the button on the bottom.
5. That's all :muscle:

Don't forget the variable name, will be used in the next section about "How to use it" the library.

# How to use it



# Available Methods


# 

