// tslint:disable-next-line:no-reference
/// <reference path="../typings/noble.d.ts" />

import {configure} from 'mobx';
import {BLEManager} from './ble-manager';
import {HubManager} from './hub-manager';

export * from './ble-manager';
export * from './hub-connection';
export * from './hub-manager';

configure({enforceActions: 'observed'});

export const hubManager = new HubManager(new BLEManager());
