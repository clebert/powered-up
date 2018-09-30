import {BLEManager, HubConnection} from '@powered-up/ble';
import {action, autorun, computed, observable} from 'mobx';
import {Hub} from './hub';
import {SmartHub} from './smart-hub';
import {SmartMoveHub} from './smart-move-hub';

let singleton: HubManager | undefined;

export class HubManager {
  public static getSingleton(): HubManager {
    if (singleton) {
      return singleton;
    }

    singleton = new HubManager(new BLEManager());

    return singleton;
  }

  /** @observable */
  @observable.shallow
  private readonly hubById: Map<string, Hub> = new Map();

  public constructor(bleManager: BLEManager) {
    autorun(() => {
      for (const hubConnection of bleManager.hubConnections) {
        this.addHub(hubConnection);
      }
    });
  }

  /** @computed */
  @computed
  public get hubs(): Hub[] {
    return [...this.hubById.values()];
  }

  @action
  private addHub(hubConnection: HubConnection): void {
    const {hubById} = this;
    const {hubId, hubType} = hubConnection;

    if (hubById.has(hubId)) {
      return;
    }

    switch (hubType) {
      case SmartHub.hubType: {
        hubById.set(hubId, new SmartHub(hubConnection));
        break;
      }
      case SmartMoveHub.hubType: {
        hubById.set(hubId, new SmartMoveHub(hubConnection));
      }
    }
  }
}
