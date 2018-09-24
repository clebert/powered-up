import {
  CommandInput,
  CommandOutput,
  ModeInput,
  Output,
  ValueInput
} from '@powered-up/protocol';
import {action, autorun, observable} from 'mobx';
import {Port} from '../port';

export abstract class Device {
  @observable
  public busy = false;

  @observable
  public disposed: boolean = false;

  @observable
  public latestError?: Error;

  protected readonly portType: number;

  @observable
  protected modeType?: number;

  @observable
  protected rawValue?: Buffer;

  public constructor(private readonly port: Port) {
    this.portType = port.portType;

    autorun(() => {
      const {latestInput} = port;

      if (latestInput instanceof CommandInput) {
        this.handleCommandInput(latestInput);
      } else if (latestInput instanceof ModeInput) {
        this.handleModeInput(latestInput);
      } else if (latestInput instanceof ValueInput) {
        this.handleValueInput(latestInput);
      }
    });
  }

  @action
  public dispose(): void {
    this.disposed = true;
  }

  @action
  protected send(output: Output): void {
    if (this.disposed) {
      this.handleError(
        new Error(
          'Unable to send message, the device is already disposed of. Please do not store references to a device outside a reaction.'
        )
      );
    } else {
      if (output instanceof CommandOutput) {
        this.busy = true;
      }

      this.port.hub.send(output);
    }
  }

  @action
  private handleError(error: Error): void {
    this.latestError = error;
  }

  @action
  private handleCommandInput(input: CommandInput): void {
    if (input.commandDiscarded) {
      this.handleError(new Error('Command discarded.'));
    }

    this.busy = input.portBusy;
  }

  @action
  private handleModeInput(input: ModeInput): void {
    this.modeType = input.modeType;
  }

  @action
  private handleValueInput(input: ValueInput): void {
    this.rawValue = input.rawValue;
  }
}
