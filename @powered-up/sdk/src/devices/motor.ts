import {DeviceType, MotorService} from '@powered-up/protocol';
import {Port} from '../port';
import {Device} from './device';

export class Motor extends Device {
  public static connectTo(port: Port): Motor | undefined {
    const connected = port.isConnected('real', DeviceType.Motor);

    return connected ? new Motor(port) : undefined;
  }

  private readonly service = new MotorService(this.port.portType);

  public brake(): void {
    this.port.send(this.service.brake());
  }

  public drift(): void {
    this.port.send(this.service.drift());
  }

  public runWithPower(power: number): void {
    this.port.send(this.service.runWithPower(power));
  }
}
