import {BLEManager} from '@powered-up/ble';
import {computed, observable, reaction} from 'mobx';
import {Hub} from './hub';
import {SmartHub} from './smart-hub';
import {SmartMoveHub} from './smart-move-hub';

export class HubManager {
  @observable.shallow
  private readonly hubById: Map<string, Hub> = new Map();

  public constructor(bleManager: BLEManager = new BLEManager()) {
    reaction(
      () => bleManager.hubConnections,
      hubConnections => {
        for (const hubConnection of hubConnections) {
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
    );
  }

  @computed
  public get hubs(): Hub[] {
    return [...this.hubById.values()];
  }
}
