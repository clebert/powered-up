// tslint:disable-next-line:no-reference
/// <reference path="../typings/noble.d.ts" />

import {configure} from 'mobx';
import {TSDI} from 'tsdi';
import {HubManager} from './hub-manager';

export * from './bluetooth';
export * from './devices';
export * from './hub-manager';
export * from './hubs';
export * from './port';

configure({enforceActions: 'observed'});

const tsdi = new TSDI();

tsdi.enableComponentScanner();

export const hubManager = tsdi.get(HubManager);
