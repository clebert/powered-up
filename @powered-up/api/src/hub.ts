import {HubConnection} from '@powered-up/ble';

export abstract class Hub {
  public readonly id: string;

  public constructor(hubConnection: HubConnection) {
    this.id = hubConnection.hubId;
  }
}
