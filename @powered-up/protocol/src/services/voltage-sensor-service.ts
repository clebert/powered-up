import {VoltageSensorModeType} from '../types';
import {PortService} from './port-service';

export class VoltageSensorService extends PortService<VoltageSensorModeType> {
  public static parseValue(rawValue: Buffer): number {
    return rawValue.readInt16LE(0);
  }
}
