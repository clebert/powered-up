import {
  CommandInput,
  DeviceInfoInput,
  DeviceType,
  ModeInfoInput,
  ModeInput,
  ValueInput
} from '@powered-up/protocol';
import {action, autorun, observable} from 'mobx';
import {
  CurrentSensor,
  Device,
  EncodedDualMotor,
  EncodedMotor,
  Motor,
  RGBLight,
  VoltageSensor
} from './devices';
import {Hub} from './hub';

export class Port {
  @observable
  public device?: Device;

  @observable
  public latestInput?: CommandInput | ModeInfoInput | ModeInput | ValueInput;

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

      if (latestPortInput instanceof DeviceInfoInput) {
        this.handleDeviceInfoInput(latestPortInput);
      } else {
        this.handleInput(latestPortInput);
      }
    });
  }

  @action
  private handleInput(
    input: CommandInput | ModeInfoInput | ModeInput | ValueInput
  ): void {
    this.latestInput = input;
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
        this.device =
          deviceInfo.kind === 'real'
            ? new EncodedMotor(this)
            : new EncodedDualMotor(this);

        break;
      }
      case DeviceType.Motor: {
        this.device = new Motor(this);
        break;
      }
      case DeviceType.RGBLight: {
        this.device = new RGBLight(this);
        break;
      }
      case DeviceType.CurrentSensor: {
        this.device = new CurrentSensor(this);
        break;
      }
      case DeviceType.VoltageSensor: {
        this.device = new VoltageSensor(this);
      }
    }
  }

  @action
  private reset(): void {
    if (this.device) {
      this.device.dispose();
    }

    this.device = undefined;
    this.latestInput = undefined;
  }
}
