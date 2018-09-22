import {
  EncodedMotorAccDecProfileType,
  EncodedMotorEndStateType,
  EncodedMotorService
} from '@powered-up/protocol';
import {Device} from './device';

export type EndState = 'Braking' | 'Drifting' | 'Holding';
export type Mode = 'Position' | 'Power' | 'Speed';

export class EncodedMotor extends Device {
  public static is(device?: Device): device is EncodedMotor {
    return device instanceof EncodedMotor;
  }

  private readonly service = new EncodedMotorService(this.port.portType, 100);

  public brake(): void {
    this.send(this.service.brake());
  }

  public drift(): void {
    this.send(this.service.drift());
  }

  public hold(): void {
    this.send(this.service.hold());
  }

  public resetPosition(position: number = 0): void {
    this.send(this.service.resetPosition(position));
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
