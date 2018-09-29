import {computed} from 'mobx';
import {
  CurrentSensor,
  EncodedMotor,
  Motor,
  RGBLight,
  VoltageSensor
} from './devices';
import {HubManager} from './hub-manager';
import {Robot} from './robot';
import {SmartHub} from './smart-hub';

export class SmartRobot extends Robot<SmartHub> {
  public constructor(hubManager: HubManager) {
    super(hubManager);

    this.observeDeviceError(() => this.encodedMotorA);
    this.observeDeviceError(() => this.encodedMotorB);
    this.observeDeviceError(() => this.motorA);
    this.observeDeviceError(() => this.motorB);
    this.observeDeviceError(() => this.rgbLight);
    this.observeDeviceError(() => this.currentSensor);
    this.observeDeviceError(() => this.voltageSensor);
  }

  @computed
  public get encodedMotorA(): EncodedMotor | undefined {
    return this.getDevice(hub => hub.a, EncodedMotor.is);
  }

  @computed
  public get encodedMotorB(): EncodedMotor | undefined {
    return this.getDevice(hub => hub.b, EncodedMotor.is);
  }

  @computed
  public get motorA(): Motor | undefined {
    return this.getDevice(hub => hub.a, Motor.is);
  }

  @computed
  public get motorB(): Motor | undefined {
    return this.getDevice(hub => hub.b, Motor.is);
  }

  @computed
  public get rgbLight(): RGBLight | undefined {
    return this.getDevice(hub => hub.rgbLight, RGBLight.is);
  }

  @computed
  public get currentSensor(): CurrentSensor | undefined {
    return this.getDevice(hub => hub.currentSensor, CurrentSensor.is);
  }

  @computed
  public get voltageSensor(): VoltageSensor | undefined {
    return this.getDevice(hub => hub.voltageSensor, VoltageSensor.is);
  }

  protected findHub(): SmartHub | undefined {
    return this.hubManager.hubs.find(SmartHub.is);
  }
}
