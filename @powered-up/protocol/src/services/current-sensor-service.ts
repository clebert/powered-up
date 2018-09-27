import {CurrentSensorModeType} from '../types';
import {PortService} from './port-service';

export class CurrentSensorService extends PortService<CurrentSensorModeType> {
  public static parseValue(rawValue: Buffer): number {
    return rawValue.readInt16LE(0);
  }
}
