import {computed} from 'mobx';
import {
  CurrentSensor,
  EncodedDualMotor,
  EncodedMotor,
  Motor,
  RGBLight,
  VoltageSensor
} from './devices';
import {HubManager} from './hub-manager';
import {Robot} from './robot';
import {SmartMoveHub} from './smart-move-hub';

export class SmartMoveRobot extends Robot<SmartMoveHub> {
  public constructor(hubManager: HubManager) {
    super(hubManager);

    this.observeDeviceError(() => this.encodedMotorA);
    this.observeDeviceError(() => this.encodedMotorB);
    this.observeDeviceError(() => this.encodedMotorAB);
    this.observeDeviceError(() => this.encodedMotorC);
    this.observeDeviceError(() => this.encodedMotorD);
    this.observeDeviceError(() => this.motorC);
    this.observeDeviceError(() => this.motorD);
    this.observeDeviceError(() => this.rgbLight);
    this.observeDeviceError(() => this.currentSensor);
    this.observeDeviceError(() => this.voltageSensor);
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
  public get encodedMotorAB(): EncodedDualMotor | undefined {
    return this.getDevice(hub => hub.encodedMotorAB, EncodedDualMotor.is);
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
  public get motorC(): Motor | undefined {
    return this.getDevice(hub => hub.c, Motor.is);
  }

  @computed
  public get motorD(): Motor | undefined {
    return this.getDevice(hub => hub.d, Motor.is);
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

  protected findHub(): SmartMoveHub | undefined {
    return this.hubManager.hubs.find(SmartMoveHub.is);
  }
}
