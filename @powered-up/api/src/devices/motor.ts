import {MotorService} from '@powered-up/protocol';
import {Device} from './device';

export class Motor extends Device {
  public static is(device?: Device): device is Motor {
    return device instanceof Motor;
  }

  private readonly service = new MotorService(this.portType);

  public brake(): void {
    this.send(this.service.brake());
  }

  public drift(): void {
    this.send(this.service.drift());
  }

  public runWithPower(power: number): void {
    this.send(this.service.runWithPower(power));
  }
}
