import {Color, RGBLightModeType, RGBLightService} from '@powered-up/protocol';
import {Device} from './device';

export class RGBLight extends Device {
  public static is(device?: Device): device is RGBLight {
    return device instanceof RGBLight;
  }

  protected readonly service = new RGBLightService(this.port.portType);

  public setColor(color: Color): void {
    this.send(this.service.setMode(RGBLightModeType.AbsoluteColor, 1, false));
    this.send(this.service.setAbsoluteColor(color));
  }
}
