# PoweredUpJS

[![Build Status](https://travis-ci.org/clebert/powered-up.svg?branch=master)](https://travis-ci.org/clebert/powered-up)
[![Package Version](https://img.shields.io/npm/v/@powered-up/api.svg)](https://yarnpkg.com/en/package/@powered-up/api)

> A Node.js SDK for programming the LEGO® Powered Up platform.

_Disclaimer: LEGO® is a trademark of the LEGO Group of companies which does not
sponsor, authorize or endorse this software._

## Getting started

The following example sets the RGB light of a Smart Move Hub (included in the
LEGO® Boost Set 17101) to red:

```js
// @ts-check

const {HubManager, SmartMoveRobot} = require('@powered-up/api');
const {autorun} = require('mobx');

const hubManager = HubManager.getSingleton();
const moveRobot = new SmartMoveRobot(hubManager);

autorun(() => {
  const {rgbLight} = moveRobot;

  if (!rgbLight) {
    return;
  }

  rgbLight.setColor({red: 255, green: 0, blue: 0});
});
```

**You can find some more examples in the
[demo package](https://github.com/clebert/powered-up/tree/master/@powered-up/demo/src).**

## Implementation status

|                           | [Smart Move Hub 2 I/O][1] ([Robot][1-1]) | [Smart Hub 2 I/O][2] ([Robot][2-1]) |
| ------------------------- | ---------------------------------------- | ----------------------------------- |
| Button                    | ✅ Supported                             | ✅ Supported                        |
| [VoltageSensor][3]        | ✅ Supported                             | ✅ Supported                        |
| [CurrentSensor][4]        | ✅ Supported                             | ✅ Supported                        |
| [RGBLight][5]             | ✅ Supported                             | ✅ Supported                        |
| [InternalEncodedMotor][6] | ✅ Supported                             | ❌ N/A                              |
| InternalTiltSensor        | 💤 Not yet implemented                   | ❌ N/A                              |
| [Motor][7]                | ✅ Supported                             | ✅ Supported                        |
| [EncodedMotor][6]         | ✅ Supported                             | ❌ Not supported                    |
| VisionSensor              | 💤 Not yet implemented                   | 💤 Not yet implemented              |

[1]: https://clebert.github.io/powered-up/packages/api/classes/smartmovehub
[1-1]: https://clebert.github.io/powered-up/packages/api/classes/smartmoverobot
[2]: https://clebert.github.io/powered-up/packages/api/classes/smarthub
[2-1]: https://clebert.github.io/powered-up/packages/api/classes/smartrobot
[3]: https://clebert.github.io/powered-up/packages/api/classes/voltagesensor
[4]: https://clebert.github.io/powered-up/packages/api/classes/currentsensor
[5]: https://clebert.github.io/powered-up/packages/api/classes/rgblight
[6]: https://clebert.github.io/powered-up/packages/api/classes/encodedmotor
[7]: https://clebert.github.io/powered-up/packages/api/classes/motor

## Packages

### [@powered-up/api](https://clebert.github.io/powered-up/packages/api/)

A reactive library for controlling LEGO® Powered Up devices.

## Internal packages

### [@powered-up/ble](https://clebert.github.io/powered-up/packages/ble/)

A reactive library for managing
[BLE](https://en.wikipedia.org/wiki/Bluetooth_Low_Energy) connections to LEGO®
Powered Up hubs.

### [@powered-up/protocol](https://clebert.github.io/powered-up/packages/protocol/)

A partial implementation of the LEGO® Powered Up
[BLE](https://en.wikipedia.org/wiki/Bluetooth_Low_Energy) protocol in
JavaScript.

---

Copyright (c) 2018-present, Clemens Akens. Released under the terms of the
[MIT License](https://github.com/clebert/powered-up/blob/master/LICENSE).
