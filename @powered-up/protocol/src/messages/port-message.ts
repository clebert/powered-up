import {Message} from './message';

export abstract class PortMessage extends Message {
  public abstract readonly portType: number;

  protected parsePortType(): number {
    return this.data.readUInt8(3);
  }
}
