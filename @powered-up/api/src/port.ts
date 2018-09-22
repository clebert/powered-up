import {DeviceInfoInput, DeviceType} from '@powered-up/protocol';
import {action, autorun, observable} from 'mobx';
import {Device, RGBLight} from './devices';
import {Hub} from './hub';

export class Port {
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

      if (!latestPortInput || latestPortInput.portType !== portType) {
        return;
      }

      if (latestPortInput instanceof DeviceInfoInput) {
        this.handleDeviceInfoInput(latestPortInput);
      }
    });
  }

  @action
  private handleDeviceInfoInput(input: DeviceInfoInput): void {
    const {deviceInfo} = input;

    if (!deviceInfo) {
      this.reset();

      return;
    }

    switch (deviceInfo.deviceType) {
      case DeviceType.RGBLight: {
        this.device = new RGBLight(this);
      }
    }
  }

  @action
  private reset(): void {
    if (this.device) {
      this.device.dispose();

      this.device = undefined;
    }
  }
}
