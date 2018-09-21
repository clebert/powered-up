import {Message} from '../message';

export class ValueInput extends Message {
  public readonly portType: number;
  public readonly rawValue: Buffer;

  public constructor(data: Buffer) {
    super(data);

    this.portType = data.readUInt8(3);
    this.rawValue = data.slice(4);
  }
}
