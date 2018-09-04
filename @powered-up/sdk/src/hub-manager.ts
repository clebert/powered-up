import {action, autorun, computed, observable} from 'mobx';
import {Peripheral} from 'noble';
import {component, inject} from 'tsdi';
import {Bluetooth} from './bluetooth';
import {Hub, createHub} from './hubs';

const bluetoothServiceUuid = '000016231212efde1623785feabcd123';

@component
export class HubManager {
  @observable.shallow
  private readonly hubById: Map<string, Hub> = new Map();

  public constructor(@inject bluetooth: Bluetooth) {
    autorun(() => {
      for (const peripheral of bluetooth.peripherals) {
        for (const serviceUuid of peripheral.advertisement.serviceUuids) {
          if (serviceUuid === bluetoothServiceUuid) {
            this.addHub(peripheral);
          }
        }
      }
    });
  }

  @computed
  public get hubIds(): string[] {
    return [...this.hubById.keys()];
  }

  @computed
  public get hubs(): Hub[] {
    return [...this.hubById.values()];
  }

  public getHub(id: string): Hub | undefined {
    return this.hubById.get(id);
  }

  @action
  private addHub(peripheral: Peripheral): void {
    const {id} = peripheral;

    if (!this.hubById.has(id)) {
      const hub = createHub(peripheral);

      if (hub) {
        this.hubById.set(id, hub);
      }
    }
  }
}
