import {CommandOutput} from '../messages';
import {
  CommandType,
  EncodedMotorAccDecProfileType,
  EncodedMotorEndStateType,
  EncodedMotorModeType
} from '../types';
import {PortService} from './port-service';

export class EncodedMotorService extends PortService<EncodedMotorModeType> {
  public constructor(
    portType: number,
    private readonly maxPower: number = 100
  ) {
    super(portType);
  }

  public parseValue(modeType: EncodedMotorModeType, value: Buffer): number {
    switch (modeType) {
      case EncodedMotorModeType.Position: {
        return value.readInt32LE(0);
      }
      case EncodedMotorModeType.Power: {
        return value.readInt8(0);
      }
      case EncodedMotorModeType.Speed: {
        return value.readInt8(0);
      }
    }
  }

  public brake(): CommandOutput {
    return this.runWithPower(127);
  }

  public drift(): CommandOutput {
    return this.runWithPower(0);
  }

  public hold(): CommandOutput {
    return this.runWithSpeed(0);
  }

  public resetPosition(position: number = 0): CommandOutput {
    const value = Buffer.alloc(4);

    value.writeInt32LE(position, 0);

    return this.setValueForMode(EncodedMotorModeType.Position, value);
  }

  public runWithPower(power: number): CommandOutput {
    const value = Buffer.alloc(1);

    value.writeInt8(power, 0);

    return this.setValueForMode(EncodedMotorModeType.Power, value);
  }

  public runWithSpeed(
    speed: number,
    accDecProfileType: EncodedMotorAccDecProfileType = EncodedMotorAccDecProfileType.Start
  ): CommandOutput {
    const commandPayload = Buffer.alloc(3);

    commandPayload.writeInt8(speed, 0);
    commandPayload.writeInt8(this.maxPower, 1);
    commandPayload.writeUInt8(accDecProfileType, 2);

    return this.executeCommand(
      CommandType.EncodedMotorRunWithSpeed,
      commandPayload
    );
  }

  public runWithSpeedForDistance(
    speed: number,
    distance: number,
    endStateType: EncodedMotorEndStateType,
    accDecProfileType: EncodedMotorAccDecProfileType = EncodedMotorAccDecProfileType.Both
  ): CommandOutput {
    const commandPayload = Buffer.alloc(8);

    commandPayload.writeInt32LE(distance, 0);
    commandPayload.writeInt8(speed, 4);
    commandPayload.writeInt8(this.maxPower, 5);
    commandPayload.writeUInt8(endStateType, 6);
    commandPayload.writeUInt8(accDecProfileType, 7);

    return this.executeCommand(
      CommandType.EncodedMotorRunWithSpeedForDistance,
      commandPayload
    );
  }

  public runWithSpeedForDuration(
    speed: number,
    duration: number,
    endStateType: EncodedMotorEndStateType,
    accDecProfileType: EncodedMotorAccDecProfileType = EncodedMotorAccDecProfileType.Both
  ): CommandOutput {
    const commandPayload = Buffer.alloc(6);

    commandPayload.writeUInt16LE(duration, 0);
    commandPayload.writeInt8(speed, 2);
    commandPayload.writeInt8(this.maxPower, 3);
    commandPayload.writeUInt8(endStateType, 4);
    commandPayload.writeUInt8(accDecProfileType, 5);

    return this.executeCommand(
      CommandType.EncodedMotorRunWithSpeedForDuration,
      commandPayload
    );
  }

  public runWithSpeedToPosition(
    speed: number,
    position: number,
    endStateType: EncodedMotorEndStateType,
    accDecProfileType: EncodedMotorAccDecProfileType = EncodedMotorAccDecProfileType.Both
  ): CommandOutput {
    const commandPayload = Buffer.alloc(8);

    commandPayload.writeInt32LE(position, 0);
    commandPayload.writeInt8(speed, 4);
    commandPayload.writeInt8(this.maxPower, 5);
    commandPayload.writeUInt8(endStateType, 6);
    commandPayload.writeUInt8(accDecProfileType, 7);

    return this.executeCommand(
      CommandType.EncodedMotorRunWithSpeedToPosition,
      commandPayload
    );
  }

  public setAccelerationDuration(
    duration: number,
    accDecProfileType: EncodedMotorAccDecProfileType = EncodedMotorAccDecProfileType.Start
  ): CommandOutput {
    const commandPayload = Buffer.alloc(3);

    commandPayload.writeUInt16LE(duration, 0);
    commandPayload.writeUInt8(accDecProfileType, 2);

    return this.executeCommand(
      CommandType.EncodedMotorSetAccelerationDuration,
      commandPayload
    );
  }

  public setDecelerationDuration(
    duration: number,
    accDecProfileType: EncodedMotorAccDecProfileType = EncodedMotorAccDecProfileType.End
  ): CommandOutput {
    const commandPayload = Buffer.alloc(3);

    commandPayload.writeUInt16LE(duration, 0);
    commandPayload.writeUInt8(accDecProfileType, 2);

    return this.executeCommand(
      CommandType.EncodedMotorSetDecelerationDuration,
      commandPayload
    );
  }
}
