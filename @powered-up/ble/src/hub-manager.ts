import {action, autorun, computed, observable} from 'mobx';
import {Peripheral} from 'noble';
import {BLEManager} from './ble-manager';
import {HubConnection} from './hub-connection';

const bleServiceUuid = '000016231212efde1623785feabcd123';

export class HubManager {
  @observable.shallow
  private readonly hubConnectionByHubId: Map<string, HubConnection> = new Map();

  public constructor(private readonly bleManager: BLEManager) {
    autorun(() => {
      for (const peripheral of bleManager.peripherals) {
        for (const serviceUuid of peripheral.advertisement.serviceUuids) {
          if (serviceUuid === bleServiceUuid) {
            this.connectToHub(peripheral);
          }
        }
      }
    });
  }

  @computed
  public get connectedHubIds(): string[] {
    return [...this.hubConnectionByHubId.keys()];
  }

  @computed
  public get hubConnections(): HubConnection[] {
    return [...this.hubConnectionByHubId.values()];
  }

  public getHubConnection(hubId: string): HubConnection | undefined {
    return this.hubConnectionByHubId.get(hubId);
  }

  @action
  private connectToHub(peripheral: Peripheral): void {
    const {id: hubId} = peripheral;

    if (!this.hubConnectionByHubId.has(hubId)) {
      const hubConnection = new HubConnection(this.bleManager, peripheral);

      if (peripheral) {
        this.hubConnectionByHubId.set(hubId, hubConnection);
      }
    }
  }
}
