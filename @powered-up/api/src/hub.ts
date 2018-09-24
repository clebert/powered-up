import {HubConnection} from '@powered-up/ble';
import {
  ErrorInput,
  ErrorType,
  HubService,
  MessageType,
  Output,
  PortInput,
  PropertyInput
} from '@powered-up/protocol';
import {action, autorun, computed, observable} from 'mobx';

export abstract class Hub {
  public readonly id: string;

  @observable
  public latestError?: Error;

  @observable
  public latestPortInput?: PortInput;

  @observable
  public latestPropertyInput?: PropertyInput;

  public constructor(private readonly hubConnection: HubConnection) {
    this.id = hubConnection.hubId;

    autorun(() => {
      const {latestError} = hubConnection;

      if (latestError) {
        this.handleError(latestError);
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
      } else {
        this.reset();
      }
    });
  }

  @computed
  public get connected(): boolean {
    return this.hubConnection.ready && !!this.latestPortInput;
  }

  public send(output: Output): void {
    if (!this.hubConnection.send(output)) {
      this.handleError(
        new Error('Unable to send message, the hub is not connected.')
      );
    }
  }

  @action
  private handleError(error: Error): void {
    this.latestError = error;
  }

  private handleErrorInput(input: ErrorInput): void {
    const {errorCausingMessageType, errorType} = input;

    const messageName = `${
      MessageType[errorCausingMessageType]
    }(${errorCausingMessageType})`;

    const errorName = `${ErrorType[errorType]}(${errorType})`;

    this.handleError(
      new Error(`${errorName} error caused by ${messageName} message.`)
    );
  }

  @action
  private handlePortInput(input: PortInput): void {
    this.latestPortInput = input;
  }

  @action
  private handlePropertyInput(input: PropertyInput): void {
    this.latestPropertyInput = input;
  }

  @action
  private reset(): void {
    this.latestError = undefined;
    this.latestPortInput = undefined;
    this.latestPropertyInput = undefined;
  }
}
