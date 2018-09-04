import {
  Color,
  DeviceType,
  RGBLightModeType,
  RGBLightService
} from '@powered-up/protocol';
import {Port} from '../port';
import {Device} from './device';

export class RGBLight extends Device {
  public static connectTo(port: Port): RGBLight | undefined {
    const connected = port.isConnected('real', DeviceType.RGBLight);

    return connected ? new RGBLight(port) : undefined;
  }

  private readonly service = new RGBLightService(this.port.portType);

  public setColor(color: Color): void {
    this.port.send(this.service.setMode(RGBLightModeType.AbsoluteColor));
    this.port.send(this.service.setAbsoluteColor(color));
  }
}
