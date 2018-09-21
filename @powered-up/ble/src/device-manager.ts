import {action, autorun, computed, observable} from 'mobx';
import {Peripheral} from 'noble';
import {Bluetooth} from './bluetooth';
import {Device} from './device';

const bluetoothServiceUuid = '000016231212efde1623785feabcd123';

export class DeviceManager {
  @observable.shallow
  private readonly deviceById: Map<string, Device> = new Map();

  public constructor(private readonly bluetooth: Bluetooth) {
    autorun(() => {
      for (const peripheral of bluetooth.peripherals) {
        for (const serviceUuid of peripheral.advertisement.serviceUuids) {
          if (serviceUuid === bluetoothServiceUuid) {
            this.addDevice(peripheral);
          }
        }
      }
    });
  }

  @computed
  public get deviceIds(): string[] {
    return [...this.deviceById.keys()];
  }

  @computed
  public get devices(): Device[] {
    return [...this.deviceById.values()];
  }

  public getDevice(id: string): Device | undefined {
    return this.deviceById.get(id);
  }

  @action
  private addDevice(peripheral: Peripheral): void {
    const {id} = peripheral;

    if (!this.deviceById.has(id)) {
      const device = new Device(this.bluetooth, peripheral);

      if (device) {
        this.deviceById.set(id, device);
      }
    }
  }
}
