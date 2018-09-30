import {
  EncodedMotorAccDecProfileType,
  EncodedMotorEndStateType,
  EncodedMotorModeType,
  EncodedMotorService
} from '@powered-up/protocol';
import {computed} from 'mobx';
import {Device} from './device';
import {Sensor} from './sensor';

export type EncodedMotorEndState = 'Braking' | 'Drifting' | 'Holding';
export type EncodedMotorMode = 'Position' | 'Power' | 'Speed';

/**
 * - Rebrickable: https://rebrickable.com/parts/6181852/
 * - BrickLink: https://www.bricklink.com/v2/catalog/catalogitem.page?P=6181852
 */
export class EncodedMotor extends Sensor<
  EncodedMotorMode,
  EncodedMotorModeType,
  EncodedMotorService
> {
  public static is(device?: Device): device is EncodedMotor {
    return device instanceof EncodedMotor;
  }

  protected readonly service = new EncodedMotorService(this.port.portType, 100);
  protected readonly valueReportThresholdDelta = 1;

  /** @computed */
  @computed
  public get position(): number | undefined {
    const {modeType, rawValue} = this;

    if (modeType !== EncodedMotorModeType.Position) {
      return undefined;
    }

    return rawValue && EncodedMotorService.parseValue(modeType, rawValue);
  }

  /** @computed */
  @computed
  public get power(): number | undefined {
    const {modeType, rawValue} = this;

    if (modeType !== EncodedMotorModeType.Power) {
      return undefined;
    }

    return rawValue && EncodedMotorService.parseValue(modeType, rawValue);
  }

  /** @computed */
  @computed
  public get speed(): number | undefined {
    const {modeType, rawValue} = this;

    if (modeType !== EncodedMotorModeType.Speed) {
      return undefined;
    }

    return rawValue && EncodedMotorService.parseValue(modeType, rawValue);
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
    endState: EncodedMotorEndState = 'Braking'
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
    endState: EncodedMotorEndState = 'Braking'
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
    endState: EncodedMotorEndState = 'Braking'
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

  protected toMode(modeType: EncodedMotorModeType): EncodedMotorMode {
    return EncodedMotorModeType[modeType] as EncodedMotorMode;
  }

  protected toModeType(mode: EncodedMotorMode): EncodedMotorModeType {
    return EncodedMotorModeType[mode];
  }
}
