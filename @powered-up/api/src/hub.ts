import {HubConnection} from '@powered-up/ble';
import {
  ErrorInput,
  ErrorType,
  HubService,
  MessageType,
  Output,
  PortInput,
  PropertyInput,
  PropertyType
} from '@powered-up/protocol';
import {action, autorun, computed, observable} from 'mobx';
import {interrupt} from './interrupt';

export abstract class Hub {
  public readonly id: string;

  @observable
  public buttonPressed = false;

  @observable
  public latestPortInput?: PortInput;

  public constructor(private readonly hubConnection: HubConnection) {
    this.id = hubConnection.hubId;

    autorun(() => {
      const {latestError} = hubConnection;

      if (latestError) {
        interrupt(latestError);
      }
    });

    autorun(() => {
      const {latestInput} = hubConnection;

      if (latestInput instanceof ErrorInput) {
        this.handleErrorInput(latestInput);
      } else if (latestInput instanceof PropertyInput) {
        this.handlePropertyInput(latestInput);
      } else if (latestInput) {
        this.handlePortInput(latestInput);
      }
    });

    autorun(() => {
      if (this.connected) {
        this.send(HubService.enableButton());
      }
    });
  }

  @computed
  public get connected(): boolean {
    return this.hubConnection.ready && !!this.latestPortInput;
  }

  public send(output: Output): void {
    if (!this.hubConnection.send(output)) {
      interrupt(new Error('Unable to send message, the hub is not connected.'));
    }
  }

  private handleErrorInput(input: ErrorInput): void {
    const {errorCausingMessageType, errorType} = input;

    const messageName = `${
      MessageType[errorCausingMessageType]
    }(${errorCausingMessageType})`;

    const errorName = `${ErrorType[errorType]}(${errorType})`;

    interrupt(
      new Error(`${errorName} error caused by ${messageName} message.`)
    );
  }

  @action
  private handlePortInput(input: PortInput): void {
    this.latestPortInput = input;
  }

  @action
  private handlePropertyInput(input: PropertyInput): void {
    const {propertyUpdate, propertyType} = input;

    if (
      propertyType === PropertyType.Button &&
      propertyUpdate &&
      propertyUpdate.kind === 'button'
    ) {
      this.buttonPressed = propertyUpdate.pressed;
    }
  }
}
