import {HubConnection} from '@powered-up/ble';
import {
  ErrorInput,
  ErrorType,
  MessageType,
  Output,
  PortInput,
  PropertyInput
} from '@powered-up/protocol';
import {action, autorun, computed, observable} from 'mobx';
import {interrupt} from './interrupt';

export abstract class Hub {
  public readonly id: string;

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

      if (!latestInput) {
        return;
      }

      if (latestInput instanceof ErrorInput) {
        this.handleErrorInput(latestInput);
      } else if (latestInput instanceof PropertyInput) {
        this.handlePropertyInput(latestInput);
      } else {
        this.handlePortInput(latestInput);
      }
    });
  }

  @computed
  public get connected(): boolean {
    return this.hubConnection.ready;
  }

  public send(output: Output): void {
    if (!this.hubConnection.send(output)) {
      interrupt(new Error('This hub is not connected.'));
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

  private handlePropertyInput(_input: PropertyInput): void {
    // TODO:
  }
}
