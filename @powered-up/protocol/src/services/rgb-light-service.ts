import {CommandOutput} from '../messages';
import {RGBLightDiscreteColorType, RGBLightModeType} from '../types';
import {PortService} from './port-service';

export interface Color {
  red: number;
  green: number;
  blue: number;
}

export class RGBLightService extends PortService<RGBLightModeType> {
  public setDiscreteColor(
    discreteColorType: RGBLightDiscreteColorType
  ): CommandOutput {
    const value = Buffer.alloc(1);

    value.writeUInt8(discreteColorType, 0);

    return this.setValueForMode(RGBLightModeType.AbsoluteColor, value);
  }

  public setAbsoluteColor(color: Color): CommandOutput {
    const value = Buffer.alloc(3);

    value.writeUInt8(color.red, 0);
    value.writeUInt8(color.green, 1);
    value.writeUInt8(color.blue, 2);

    return this.setValueForMode(RGBLightModeType.AbsoluteColor, value);
  }
}
