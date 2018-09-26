import {CommandOutput} from '../messages';
import {
  CommandType,
  EncodedMotorAccDecProfileType,
  EncodedMotorEndStateType,
  EncodedMotorModeType
} from '../types';
import {PortService} from './port-service';

export class EncodedDualMotorService extends PortService<EncodedMotorModeType> {
  public constructor(portType: number, private readonly maxPower: number) {
    super(portType);
  }

  public setPosition(positionA: number, positionB: number): CommandOutput {
    const commandPayload = Buffer.alloc(8);

    commandPayload.writeInt32LE(positionA, 0);
    commandPayload.writeInt32LE(positionB, 4);

    return this.executeCommand(
      CommandType.EncodedDualMotorSetPosition,
      commandPayload
    );
  }

  public brake(): CommandOutput {
    return this.runWithPower(127, 127);
  }

  public drift(): CommandOutput {
    return this.runWithPower(0, 0);
  }

  public hold(): CommandOutput {
    return this.runWithSpeed(0, 0, EncodedMotorAccDecProfileType.None);
  }

  public runWithPower(powerA: number, powerB: number): CommandOutput {
    const commandPayload = Buffer.alloc(2);

    commandPayload.writeInt8(powerA, 0);
    commandPayload.writeInt8(powerB, 1);

    return this.executeCommand(
      CommandType.EncodedDualMotorRunWithPower,
      commandPayload
    );
  }

  public runWithSpeed(
    speedA: number,
    speedB: number,
    accDecProfileType: EncodedMotorAccDecProfileType
  ): CommandOutput {
    const commandPayload = Buffer.alloc(4);

    commandPayload.writeInt8(speedA, 0);
    commandPayload.writeInt8(speedB, 1);
    commandPayload.writeInt8(this.maxPower, 2);
    commandPayload.writeUInt8(accDecProfileType, 3);

    return this.executeCommand(
      CommandType.EncodedDualMotorRunWithSpeed,
      commandPayload
    );
  }

  public runWithSpeedForDistance(
    speedA: number,
    speedB: number,
    distance: number,
    endStateType: EncodedMotorEndStateType,
    accDecProfileType: EncodedMotorAccDecProfileType
  ): CommandOutput {
    const commandPayload = Buffer.alloc(9);

    commandPayload.writeInt32LE(distance, 0);
    commandPayload.writeInt8(speedA, 4);
    commandPayload.writeInt8(speedB, 5);
    commandPayload.writeInt8(this.maxPower, 6);
    commandPayload.writeUInt8(endStateType, 7);
    commandPayload.writeUInt8(accDecProfileType, 8);

    return this.executeCommand(
      CommandType.EncodedDualMotorRunWithSpeedForDistance,
      commandPayload
    );
  }

  public runWithSpeedForDuration(
    speedA: number,
    speedB: number,
    duration: number,
    endStateType: EncodedMotorEndStateType,
    accDecProfileType: EncodedMotorAccDecProfileType
  ): CommandOutput {
    const commandPayload = Buffer.alloc(7);

    commandPayload.writeUInt16LE(duration, 0);
    commandPayload.writeInt8(speedA, 2);
    commandPayload.writeInt8(speedB, 3);
    commandPayload.writeInt8(this.maxPower, 4);
    commandPayload.writeUInt8(endStateType, 5);
    commandPayload.writeUInt8(accDecProfileType, 6);

    return this.executeCommand(
      CommandType.EncodedDualMotorRunWithSpeedForDuration,
      commandPayload
    );
  }

  public runWithSpeedToPosition(
    speed: number,
    positionA: number,
    positionB: number,
    endStateType: EncodedMotorEndStateType,
    accDecProfileType: EncodedMotorAccDecProfileType
  ): CommandOutput {
    const commandPayload = Buffer.alloc(12);

    commandPayload.writeInt32LE(positionA, 0);
    commandPayload.writeInt32LE(positionB, 4);
    commandPayload.writeInt8(speed, 8);
    commandPayload.writeInt8(this.maxPower, 9);
    commandPayload.writeUInt8(endStateType, 10);
    commandPayload.writeUInt8(accDecProfileType, 11);

    return this.executeCommand(
      CommandType.EncodedDualMotorRunWithSpeedToPosition,
      commandPayload
    );
  }
}
