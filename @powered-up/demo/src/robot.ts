import {
  EncodedMotor,
  HubManager,
  RGBLight,
  SmartMoveHub
} from '@powered-up/api';
import {computed} from 'mobx';

function interrupt(error: Error): void {
  setImmediate(() => {
    throw error;
  });
}

export class Robot {
  public constructor(
    private readonly hubManager: HubManager = new HubManager()
  ) {}

  @computed
  public get buttonPressed(): boolean {
    return !!(this.hub && this.hub.buttonPressed);
  }

  @computed
  public get motorA(): EncodedMotor | undefined {
    const hub = this.hub;

    if (!hub) {
      return;
    }

    const {device} = hub.encodedMotorA;

    if (!EncodedMotor.is(device)) {
      return;
    }

    if (device.latestError) {
      interrupt(device.latestError);
    }

    return device;
  }

  @computed
  public get statusLight(): RGBLight | undefined {
    const hub = this.hub;

    if (!hub) {
      return;
    }

    const {device} = hub.rgbLight;

    if (!RGBLight.is(device)) {
      return;
    }

    if (device.latestError) {
      interrupt(device.latestError);
    }

    return device;
  }

  @computed
  private get hub(): SmartMoveHub | undefined {
    const hub = this.hubManager.hubs.find(SmartMoveHub.is);

    if (!hub || !hub.connected) {
      return;
    }

    if (hub.latestError) {
      interrupt(hub.latestError);
    }

    return hub;
  }
}
