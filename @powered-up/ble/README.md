# @powered-up/ble

[![Package Version](https://img.shields.io/npm/v/@powered-up/ble.svg)](https://yarnpkg.com/en/package/@powered-up/ble)

> A reactive library for managing BLE connections to LEGO® Powered Up hubs.

**This package is part of
[PoweredUpJS](https://github.com/clebert/powered-up).**

_Disclaimer: LEGO® is a trademark of the LEGO Group of companies which does not
sponsor, authorize or endorse this software._

## Getting started

Install `@powered-up/ble` as a dependency:

```sh
# Install using Yarn
yarn add @powered-up/ble
```

```sh
# Install using npm
npm install @powered-up/ble
```

### Installation problems under Node 10 on macOS 10.13.4

For the BLE connection [noble](https://github.com/noble/noble/issues/791) is
used, it needs xpc-connection on macOS, which currently cannot be build without
errors. Until the problem is officially fixed, the following must be added to
your package.json:

```json
"resolutions": {
  "xpc-connection": "sandeepmistry/node-xpc-connection#pull/26/head"
}
```

---

Copyright (c) 2018-present, Clemens Akens. Released under the terms of the
[MIT License](https://github.com/clebert/powered-up/blob/master/LICENSE).
