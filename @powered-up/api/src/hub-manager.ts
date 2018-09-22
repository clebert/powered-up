import {BLEManager} from '@powered-up/ble';
import {autorun, computed, observable} from 'mobx';
import {Hub} from './hub';
import {SmartHub} from './smart-hub';
import {SmartMoveHub} from './smart-move-hub';

export class HubManager {
  public static readonly instance = new HubManager();

  @observable.shallow
  private readonly hubById: Map<string, Hub> = new Map();

  private constructor() {
    autorun(() => {
      for (const hubConnection of BLEManager.instance.hubConnections) {
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
    });
  }

  @computed
  public get hubs(): Hub[] {
    return [...this.hubById.values()];
  }
}
