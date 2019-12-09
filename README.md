![logo](/docs/assets/img/logo.png)

# [Postman-util-lib](https://joolfe.github.io/postman-util-lib/)
[![build](https://img.shields.io/github/workflow/status/joolfe/postman-util-lib/Node%20CI?&label=Build&logo=github&style=flat-square)](https://github.com/joolfe/postman-util-lib/actions)
[![codecov](https://img.shields.io/codecov/c/github/joolfe/postman-util-lib?logo=codecov&style=flat-square)](https://codecov.io/gh/joolfe/postman-util-lib)
![build](https://img.shields.io/badge/Postman-%3E=7.0.9-green?logo=postman&style=flat-square&color=FF6C37)

Postman-util-lib is a JavaScript library bundle to squeeze Postman script allowing you to easy use lot of cryptography method from `Pre-request Script` and `Tests` tabs in Postman.

# DEVELOPMENT INSTRUCTIONS

For develop in local please use:

- Node.js v10.15.3 or higher
- [Standard JS](https://standardjs.com/) rules to maintain clean code.

Use the scripts in `package.json`:

- `test:unit`: Run mocha unit test.
- `test:lint`: Execute unit test plus standard rules check.
- `test`: Execute `test:lint` plus code coverage.
- `build`: Create a browserify version of the lib in `docs/disct`
- `dev`: Run build script and start a dev server in localhost.
- `test:e2e`: Run a newman test using a colleciton agains the deployed github pages.

Deployment is just push the changes to the git repo and will be deployed into github pages.

There are two configured `Github Actions`:
- `Build Node`: on `push` do npm install, test and upload coverage in Node.js 10 and 12.
- `Test`: on `page_build` execute newman e2e test agains the deployed distribution.

Husky is setup to avoid push incorrect content ot the git.

# TAGS

`Nodejs` `Javascript` `Jeckyll` `Mocha` `Postman` `Crypto` `Newman`

# LICENSE

See the [LICENSE](https://github.com/joolfe/postman-util-lib/blob/master/LICENSE) file.