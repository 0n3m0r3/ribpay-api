<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).






# RIBPay API

A brief description of the behavior of the API


## Documentation

### Contracts

Contracts are not automaticlly created when an account is created.

For now the only allowed ```contract_type``` is ```RIBPAY```

Contrcats cannot be created if the account they are associated with is not active (has been deleted, or has not been activated by user)

Once a contract is created it can be used for transactions immediately

A contract is allways associated with an account (if you want to change the account assoxciated with it you have to delete the contract and recreate it)

To be used, a contract must be associated with a Terminal (both associated to the same account)

A Terminal can only have one contract of each type associated with it (for now the API only supports type ```RIBPAY```)

A contract dont need to be associated with a Terminal (but cannot be used to create Transactions until it is associated with one)

The subscription type will be defined by the Terminal it is associated with


### Terminals

The account associated to a Terminal connot be changed.

You can update the Terminal name (```terminal_label```), and the ```terminal_favorite_contract_type```, which set the contract to display first (can be ignored)

A Terminal can only have one Contract of each type associated with it (see Contrcats)

A Terminal can only have one subscritption type. All active contrcats on this Terminal will also use this subscription type.

To change the subscription type, you need to delete the Terminal and create a new one.

### Users

There will be only one ```admin``` User per Account. 
The ```admin```User is created with the Account.

Any User created through the user endpoint will have the role ```user```
The ```admin``` User cannot be deleted.
To be deleted, the account associated with the ```admin```User must first be deleted.
The ```admin``` User will need to add info to activate his Account. This can either be done through the link provided one the creation, or throught an API call.

It is possible to add Users to an Account that has not yet been activated.

The info needed will depend on the ```account_type```.
For a ```personnePhysique``` the fields : ```first_name```, ```last_name```, ```birth_date```, ```birth_city```and ```birth_country``` are required.
For a ```personneMorale``` only a file of an ID Card is required.

This info can either be added through the API (see ```/validate```) or by filling out the form accessible at the ```account_creation_url```.
This can be usefull if you don't have this info yourself, so you just have to send your customer the link.


az login

az acr login --name ribpaydab

docker build --platform linux/amd64 . -t ribpaydab.azurecr.io/ribpay-api:v2

docker push ribpaydab.azurecr.io/ribpay-api:v2