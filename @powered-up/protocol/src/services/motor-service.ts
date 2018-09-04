import {CommandOutput} from '../messages';
import {MotorModeType} from '../types';
import {PortService} from './port-service';

export class MotorService extends PortService<MotorModeType> {
  public brake(): CommandOutput {
    return this.runWithPower(127);
  }

  public drift(): CommandOutput {
    return this.runWithPower(0);
  }

  public runWithPower(power: number): CommandOutput {
    const value = Buffer.alloc(1);

    value.writeInt8(power, 0);

    return this.setValueForMode(MotorModeType.Power, value);
  }

  public parsePowerValue(value: Buffer): number {
    return value.readInt8(0);
  }
}
