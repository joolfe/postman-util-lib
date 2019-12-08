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

Deployment is just push the changes to the git repo and will be deployed into github pages, also `Github Actions` will be executed to build, test and coverage.

# ROADMAP

- Create a postman test collection
- Run with newman in local
- Put a github actions for newman?
- Husky for avoid errors when push from local?

# TAGS

`Nodejs` `Javascript` `Jeckyll` `Mocha` `Postman` `Crypto` `Newman`

# LICENSE

See the [LICENSE](https://github.com/joolfe/postman-util-lib/blob/master/LICENSE) file.