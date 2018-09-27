import {
  CurrentSensorModeType,
  CurrentSensorService
} from '@powered-up/protocol';
import {computed} from 'mobx';
import {Device} from './device';
import {Sensor} from './sensor';

export type CurrentSensorMode = 'Milliamps';

export class CurrentSensor extends Sensor<
  CurrentSensorMode,
  CurrentSensorModeType,
  CurrentSensorService
> {
  public static is(device?: Device): device is CurrentSensor {
    return device instanceof CurrentSensor;
  }

  protected readonly service = new CurrentSensorService(this.port.portType);
  protected readonly valueReportThresholdDelta = 30;

  @computed
  public get milliamps(): number | undefined {
    const {modeType, rawValue} = this;

    if (modeType !== CurrentSensorModeType.Milliamps) {
      return undefined;
    }

    return rawValue && CurrentSensorService.parseValue(rawValue);
  }

  protected toMode(modeType: CurrentSensorModeType): CurrentSensorMode {
    return CurrentSensorModeType[modeType] as CurrentSensorMode;
  }

  protected toModeType(mode: CurrentSensorMode): CurrentSensorModeType {
    return CurrentSensorModeType[mode];
  }
}
