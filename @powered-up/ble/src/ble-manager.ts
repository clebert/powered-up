import {action, computed, observable} from 'mobx';
import noble, {Peripheral} from 'noble';
import {HubConnection} from './hub-connection';

export class BLEManager {
  @observable.shallow
  private readonly hubConnectionByHubId: Map<string, HubConnection> = new Map();

  @observable
  private state = 'unknown';

  public constructor() {
    noble.on('discover', this.handleDiscovery.bind(this));
    noble.on('stateChange', this.handleStateChange.bind(this));
  }

  @computed
  public get ready(): boolean {
    return this.state === 'poweredOn';
  }

  @computed
  public get hubConnections(): HubConnection[] {
    return [...this.hubConnectionByHubId.values()];
  }

  @action
  private handleDiscovery(peripheral: Peripheral): void {
    for (const serviceUuid of peripheral.advertisement.serviceUuids) {
      if (serviceUuid === '000016231212efde1623785feabcd123') {
        const {id: hubId} = peripheral;

        if (!this.hubConnectionByHubId.has(hubId)) {
          const hubConnection = new HubConnection(peripheral, this);

          this.hubConnectionByHubId.set(hubId, hubConnection);
        }
      }
    }
  }

  @action
  private handleStateChange(state: string): void {
    this.state = state;

    if (state === 'poweredOn') {
      noble.startScanning();
    } else {
      noble.stopScanning();
    }
  }
}
