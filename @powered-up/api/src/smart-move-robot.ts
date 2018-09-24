import {computed} from 'mobx';
import {EncodedMotor, RGBLight} from './devices';
import {HubManager} from './hub-manager';
import {Robot} from './robot';
import {SmartMoveHub} from './smart-move-hub';

export class SmartMoveRobot extends Robot<SmartMoveHub> {
  public constructor(hubManager: HubManager) {
    super(hubManager);

    this.observeDeviceError(() => this.encodedMotorA);
    this.observeDeviceError(() => this.encodedMotorB);
    this.observeDeviceError(() => this.encodedMotorC);
    this.observeDeviceError(() => this.encodedMotorD);
    this.observeDeviceError(() => this.rgbLight);
  }

  @computed
  public get encodedMotorA(): EncodedMotor | undefined {
    return this.getDevice(hub => hub.encodedMotorA, EncodedMotor.is);
  }

  @computed
  public get encodedMotorB(): EncodedMotor | undefined {
    return this.getDevice(hub => hub.encodedMotorB, EncodedMotor.is);
  }

  @computed
  public get encodedMotorC(): EncodedMotor | undefined {
    return this.getDevice(hub => hub.c, EncodedMotor.is);
  }

  @computed
  public get encodedMotorD(): EncodedMotor | undefined {
    return this.getDevice(hub => hub.d, EncodedMotor.is);
  }

  @computed
  public get rgbLight(): RGBLight | undefined {
    return this.getDevice(hub => hub.rgbLight, RGBLight.is);
  }

  protected findHub(): SmartMoveHub | undefined {
    return this.hubManager.hubs.find(SmartMoveHub.is);
  }
}
