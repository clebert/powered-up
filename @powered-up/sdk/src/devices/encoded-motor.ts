import {
  DeviceType,
  EncodedMotorAccDecProfileType,
  EncodedMotorEndStateType,
  EncodedMotorModeType,
  EncodedMotorService
} from '@powered-up/protocol';
import {computed} from 'mobx';
import {Port} from '../port';
import {Device} from './device';

export type EndState = 'Braking' | 'Drifting' | 'Holding';
export type Mode = 'Position' | 'Power' | 'Speed';

export class EncodedMotor extends Device {
  public static connectTo(port: Port): EncodedMotor | undefined {
    const connected = port.isConnected(
      'real',
      DeviceType.EncodedMotor,
      DeviceType.InternalEncodedMotor
    );

    return connected ? new EncodedMotor(port) : undefined;
  }

  private readonly service = new EncodedMotorService(this.port.portType, 100);

  public get mode(): Mode | undefined {
    const {modeType} = this.port;

    if (modeType === undefined) {
      return;
    }

    return EncodedMotorModeType[modeType] as Mode;
  }

  @computed
  public get position(): number | undefined {
    const {modeType, rawValue} = this.port;

    if (modeType !== EncodedMotorModeType.Position) {
      return undefined;
    }

    return rawValue && this.service.parseValue(modeType, rawValue);
  }

  @computed
  public get power(): number | undefined {
    const {modeType, rawValue} = this.port;

    if (modeType !== EncodedMotorModeType.Power) {
      return undefined;
    }

    return rawValue && this.service.parseValue(modeType, rawValue);
  }

  @computed
  public get speed(): number | undefined {
    const {modeType, rawValue} = this.port;

    if (modeType !== EncodedMotorModeType.Speed) {
      return undefined;
    }

    return rawValue && this.service.parseValue(modeType, rawValue);
  }

  public brake(): void {
    this.port.send(this.service.brake());
  }

  public drift(): void {
    this.port.send(this.service.drift());
  }

  public hold(): void {
    this.port.send(this.service.hold());
  }

  public resetPosition(position: number = 0): void {
    this.port.send(this.service.resetPosition(position));
  }

  public runWithPower(power: number): void {
    this.port.send(this.service.runWithPower(power));
  }

  public runWithSpeed(speed: number): void {
    this.port.send(
      this.service.runWithSpeed(speed, EncodedMotorAccDecProfileType.None)
    );
  }

  public runWithSpeedForDistance(
    speed: number,
    distance: number,
    endState: EndState = 'Braking'
  ): void {
    this.port.send(
      this.service.runWithSpeedForDistance(
        speed,
        distance,
        EncodedMotorEndStateType[endState],
        EncodedMotorAccDecProfileType.None
      )
    );
  }

  public runWithSpeedForDuration(
    speed: number,
    duration: number,
    endState: EndState = 'Braking'
  ): void {
    this.port.send(
      this.service.runWithSpeedForDuration(
        speed,
        duration,
        EncodedMotorEndStateType[endState],
        EncodedMotorAccDecProfileType.None
      )
    );
  }

  public runWithSpeedToPosition(
    speed: number,
    position: number,
    endState: EndState = 'Braking'
  ): void {
    this.port.send(
      this.service.runWithSpeedToPosition(
        speed,
        position,
        EncodedMotorEndStateType[endState],
        EncodedMotorAccDecProfileType.None
      )
    );
  }

  public setMode(mode: Mode): void {
    this.port.send(this.service.setMode(EncodedMotorModeType[mode]));
  }
}
