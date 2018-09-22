import {CommandInput, DeviceInfoInput, DeviceType} from '@powered-up/protocol';
import {action, autorun, observable} from 'mobx';
import {Device, EncodedMotor, RGBLight} from './devices';
import {Hub} from './hub';
import {interrupt} from './interrupt';

export class Port {
  @observable
  public busy = false;

  @observable
  public device?: Device;

  public constructor(
    public readonly portType: number,
    public readonly hub: Hub
  ) {
    autorun(() => {
      if (!hub.connected) {
        this.reset();
      }
    });

    autorun(() => {
      const {latestPortInput} = hub;

      if (
        !hub.connected ||
        !latestPortInput ||
        latestPortInput.portType !== portType
      ) {
        return;
      }

      if (latestPortInput instanceof CommandInput) {
        this.handleCommandInput(latestPortInput);
      } else if (latestPortInput instanceof DeviceInfoInput) {
        this.handleDeviceInfoInput(latestPortInput);
      }
    });
  }

  @action
  private handleCommandInput(input: CommandInput): void {
    if (input.commandDiscarded) {
      interrupt(new Error('The last command sent was discarded by the Hub.'));
    }

    this.busy = input.portBusy;
  }

  @action
  private handleDeviceInfoInput(input: DeviceInfoInput): void {
    const {deviceInfo} = input;

    if (!deviceInfo) {
      this.reset();

      return;
    }

    switch (deviceInfo.deviceType) {
      case DeviceType.EncodedMotor:
      case DeviceType.InternalEncodedMotor: {
        if (deviceInfo.kind === 'real') {
          this.device = new EncodedMotor(this);
        }
        break;
      }
      case DeviceType.RGBLight: {
        this.device = new RGBLight(this);
      }
    }
  }

  @action
  private reset(): void {
    if (this.device) {
      this.device.dispose();

      this.busy = false;
      this.device = undefined;
    }
  }
}
