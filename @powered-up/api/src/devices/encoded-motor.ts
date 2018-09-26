import {
  EncodedMotorAccDecProfileType,
  EncodedMotorEndStateType,
  EncodedMotorModeType,
  EncodedMotorService
} from '@powered-up/protocol';
import {computed} from 'mobx';
import {Device} from './device';

export type EndState = 'Braking' | 'Drifting' | 'Holding';
export type Mode = 'Position' | 'Power' | 'Speed';

export class EncodedMotor extends Device {
  public static is(device?: Device): device is EncodedMotor {
    return device instanceof EncodedMotor;
  }

  private readonly service = new EncodedMotorService(this.portType, 100);

  @computed
  public get position(): number | undefined {
    const {modeType, rawValue} = this;

    if (modeType !== EncodedMotorModeType.Position) {
      return undefined;
    }

    return rawValue && EncodedMotorService.parseValue(modeType, rawValue);
  }

  @computed
  public get power(): number | undefined {
    const {modeType, rawValue} = this;

    if (modeType !== EncodedMotorModeType.Power) {
      return undefined;
    }

    return rawValue && EncodedMotorService.parseValue(modeType, rawValue);
  }

  @computed
  public get speed(): number | undefined {
    const {modeType, rawValue} = this;

    if (modeType !== EncodedMotorModeType.Speed) {
      return undefined;
    }

    return rawValue && EncodedMotorService.parseValue(modeType, rawValue);
  }

  @computed
  public get mode(): Mode | undefined {
    const {modeType} = this;

    if (modeType === undefined) {
      return;
    }

    return EncodedMotorModeType[modeType] as Mode;
  }

  public setMode(mode: Mode): void {
    this.send(this.service.setMode(EncodedMotorModeType[mode]));
  }

  public setPosition(position: number): void {
    this.send(this.service.setPosition(position));
  }

  public brake(): void {
    this.send(this.service.brake());
  }

  public drift(): void {
    this.send(this.service.drift());
  }

  public hold(): void {
    this.send(this.service.hold());
  }

  public runWithPower(power: number): void {
    this.send(this.service.runWithPower(power));
  }

  public runWithSpeed(speed: number): void {
    this.send(
      this.service.runWithSpeed(speed, EncodedMotorAccDecProfileType.None)
    );
  }

  public runWithSpeedForDistance(
    speed: number,
    distance: number,
    endState: EndState = 'Braking'
  ): void {
    this.send(
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
    this.send(
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
    this.send(
      this.service.runWithSpeedToPosition(
        speed,
        position,
        EncodedMotorEndStateType[endState],
        EncodedMotorAccDecProfileType.None
      )
    );
  }
}
