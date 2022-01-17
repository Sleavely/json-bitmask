# json-bitmask

Minimal utility for de-/serializing bitmask flags.

[ ![npm version](https://img.shields.io/npm/v/json-bitmask.svg?style=flat) ](https://npmjs.org/package/json-bitmask "View package")
[ ![CI status](https://github.com/Sleavely/json-bitmask/actions/workflows/node.js.yml/badge.svg) ](https://github.com/Sleavely/json-bitmask/actions/workflows/node.js.yml "View workflow")
## Installation

```sh
npm i json-bitmask
```

## Usage

First, let's define our flags in a file we'll call `permissions.js`:

```js
const bitmask = require('json-bitmask')

/**
 * Each flag needs to increment the value by 2x to work as a bitmask
 */
const PERMISSIONS = {
  BILLING: 1,
  CREATE_API_KEYS: 2,
  READ_API_KEYS: 4,
}

const parseMask = bitmask.from(PERMISSIONS)

module.exports = exports = {
  PERMISSIONS,
  parseMask,
}
```

### Parsing and Reading

```js
const { parseMask } = require('./permissions')

// Pretend we got a user from our database
const user = {
  username: 'Sleavely',
  permissions: 5
}

// Lets deserialize the permissions to something readable
user.permissions = parseMask(user.permissions)

// Now our user object looks like:
{
  username: 'Sleavely',
  permissions: {
    BILLING: true,
    CREATE_API_KEYS: false,
    READ_API_KEYS: true,
  }
}
```

We've converted a fairly small value to something that is a breeze to work with:

```js
if (!user.permissions.BILLING) {
  throw new Error('You are not allowed to manage billing!')
}
```

### Editing and saving

```js
user.permissions.BILLING = false
```

`json-bitmask` will automatically return the integer representation when you try to perform math or JSON.stringify() on it:

```js

const serializedUser = JSON.stringify(user)
// Note that because we removed the BILLING permission, the value has changed to 4
// {"username":"Sleavely","permissions":4}

saveToDatabase(serializedUser)
```
