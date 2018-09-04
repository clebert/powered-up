import {
  CommandInput,
  CommandOutput,
  DeviceInfoInput,
  DeviceType,
  Message,
  ModeInput,
  ValueInput
} from '@powered-up/protocol';
import {action, computed, observable, reaction} from 'mobx';
import {Hub} from './hubs';
import {interrupt} from './utils';

export class Port {
  @observable
  public busy = false;

  @observable
  private latestDeviceInfoInput?: DeviceInfoInput;

  @observable
  private latestModeInput?: ModeInput;

  @observable
  private latestValueInput?: ValueInput;

  public constructor(
    public readonly portType: number,
    private readonly hub: Hub
  ) {
    reaction(
      () => {
        const {latestPortInput} = hub;

        if (!latestPortInput || latestPortInput.portType !== portType) {
          return;
        }

        return latestPortInput;
      },
      latestInput => {
        if (latestInput instanceof CommandInput) {
          if (latestInput.commandDiscarded) {
            interrupt(
              new Error('The last command sent was discarded by the Hub.')
            );
          }

          this.busy = latestInput.portBusy;
        } else if (latestInput instanceof DeviceInfoInput) {
          this.latestDeviceInfoInput = latestInput;
        } else if (latestInput instanceof ModeInput) {
          this.latestModeInput = latestInput;
          this.latestValueInput = undefined;
        } else if (latestInput instanceof ValueInput) {
          this.latestValueInput = latestInput;
        }
      }
    );
  }

  @computed
  public get modeType(): number | undefined {
    return this.latestModeInput && this.latestModeInput.modeType;
  }

  @computed
  public get rawValue(): Buffer | undefined {
    return this.latestValueInput && this.latestValueInput.rawValue;
  }

  public isConnected(
    deviceKind: 'real' | 'virtual',
    ...deviceTypes: DeviceType[]
  ): boolean {
    const {latestDeviceInfoInput} = this;

    if (!latestDeviceInfoInput) {
      return false;
    }

    const {deviceInfo} = latestDeviceInfoInput;

    if (!deviceInfo) {
      return false;
    }

    return (
      deviceKind === deviceInfo.kind &&
      !!deviceTypes.find(deviceType => deviceType === deviceInfo.deviceType)
    );
  }

  @action
  public send(output: Message): void {
    const result = this.hub.send(output);

    if (output instanceof CommandOutput) {
      this.busy = result;
    }
  }
}
