import {PortMessage} from '../port-message';

export class ValueInput extends PortMessage {
  public readonly portType: number;
  public readonly rawValue: Buffer;

  public constructor(data: Buffer) {
    super(data);

    this.portType = this.parsePortType();
    this.rawValue = data.slice(4);
  }
}
