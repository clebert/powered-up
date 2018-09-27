import {
  VoltageSensorModeType,
  VoltageSensorService
} from '@powered-up/protocol';
import {computed} from 'mobx';
import {Device} from './device';
import {Sensor} from './sensor';

export type VoltageSensorMode = 'Millivolts';

export class VoltageSensor extends Sensor<
  VoltageSensorMode,
  VoltageSensorModeType,
  VoltageSensorService
> {
  public static is(device?: Device): device is VoltageSensor {
    return device instanceof VoltageSensor;
  }

  protected readonly service = new VoltageSensorService(this.port.portType);
  protected readonly valueReportThresholdDelta = 30;

  @computed
  public get millivolts(): number | undefined {
    const {modeType, rawValue} = this;

    if (modeType !== VoltageSensorModeType.Millivolts) {
      return undefined;
    }

    return rawValue && VoltageSensorService.parseValue(rawValue);
  }

  protected toMode(modeType: VoltageSensorModeType): VoltageSensorMode {
    return VoltageSensorModeType[modeType] as VoltageSensorMode;
  }

  protected toModeType(mode: VoltageSensorMode): VoltageSensorModeType {
    return VoltageSensorModeType[mode];
  }
}
