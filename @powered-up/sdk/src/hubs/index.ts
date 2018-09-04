import {Peripheral} from 'noble';
import {Hub} from './hub';
import {SmartHub} from './smart-hub';
import {SmartMoveHub} from './smart-move-hub';

export * from './hub';
export * from './smart-hub';
export * from './smart-move-hub';

export function createHub(peripheral: Peripheral): Hub | undefined {
  switch (peripheral.advertisement.manufacturerData.readUInt8(3)) {
    case SmartHub.hubType: {
      return new SmartHub(peripheral);
    }
    case SmartMoveHub.hubType: {
      return new SmartMoveHub(peripheral);
    }
    default: {
      return;
    }
  }
}
