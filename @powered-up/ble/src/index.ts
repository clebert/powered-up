// tslint:disable-next-line:no-reference
/// <reference path="../typings/noble.d.ts" />

import {configure} from 'mobx';
import {Bluetooth} from './bluetooth';
import {DeviceManager} from './device-manager';

export * from './bluetooth';
export * from './device';
export * from './device-manager';

configure({enforceActions: 'observed'});

export const deviceManager = new DeviceManager(new Bluetooth());
