import {PortService} from '@powered-up/protocol';
import {computed} from 'mobx';
import {Device} from './device';

export abstract class Sensor<
  TMode extends string,
  TModeType extends number,
  TService extends PortService<TModeType>
> extends Device {
  protected abstract readonly service: TService;
  protected abstract readonly valueReportThresholdDelta: number;

  /** @computed */
  @computed
  public get mode(): TMode | undefined {
    const {modeType} = this;

    if (modeType === undefined) {
      return;
    }

    return this.toMode(modeType as TModeType);
  }

  public setMode(mode: TMode): void {
    this.send(
      this.service.setMode(
        this.toModeType(mode),
        this.valueReportThresholdDelta,
        true
      )
    );
  }

  protected abstract toMode(modeType: TModeType): TMode;
  protected abstract toModeType(mode: TMode): TModeType;
}
