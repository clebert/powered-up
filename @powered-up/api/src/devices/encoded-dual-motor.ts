import {
  EncodedDualMotorService,
  EncodedMotorAccDecProfileType,
  EncodedMotorEndStateType
} from '@powered-up/protocol';
import {Device} from './device';
import {EncodedMotorEndState} from './encoded-motor';

export class EncodedDualMotor extends Device {
  public static is(device?: Device): device is EncodedDualMotor {
    return device instanceof EncodedDualMotor;
  }

  protected readonly service = new EncodedDualMotorService(
    this.port.portType,
    100
  );

  public setPosition(positionA: number, positionB: number): void {
    this.send(this.service.setPosition(positionA, positionB));
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

  public runWithPower(powerA: number, powerB: number): void {
    this.send(this.service.runWithPower(powerA, powerB));
  }

  public runWithSpeed(speedA: number, speedB: number): void {
    this.send(
      this.service.runWithSpeed(
        speedA,
        speedB,
        EncodedMotorAccDecProfileType.None
      )
    );
  }

  public runWithSpeedForDistance(
    speedA: number,
    speedB: number,
    distance: number,
    endState: EncodedMotorEndState = 'Braking'
  ): void {
    this.send(
      this.service.runWithSpeedForDistance(
        speedA,
        speedB,
        distance,
        EncodedMotorEndStateType[endState],
        EncodedMotorAccDecProfileType.None
      )
    );
  }

  public runWithSpeedForDuration(
    speedA: number,
    speedB: number,
    duration: number,
    endState: EncodedMotorEndState = 'Braking'
  ): void {
    this.send(
      this.service.runWithSpeedForDuration(
        speedA,
        speedB,
        duration,
        EncodedMotorEndStateType[endState],
        EncodedMotorAccDecProfileType.None
      )
    );
  }

  public runWithSpeedToPosition(
    speed: number,
    positionA: number,
    positionB: number,
    endState: EncodedMotorEndState = 'Braking'
  ): void {
    this.send(
      this.service.runWithSpeedToPosition(
        speed,
        positionA,
        positionB,
        EncodedMotorEndStateType[endState],
        EncodedMotorAccDecProfileType.None
      )
    );
  }
}
