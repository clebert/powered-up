import {MessageType} from '../../types';
import {PortMessage} from '../port-message';

export class ModeOutput extends PortMessage {
  public constructor(
    public readonly portType: number,
    public readonly modeType: number,
    public readonly valueReportInterval: number,
    public readonly valueReportEnabled: boolean
  ) {
    super(Buffer.alloc(10));

    const {data} = this;

    data.writeUInt8(data.length, 0);
    data.writeUInt8(0, 1);
    data.writeUInt8(MessageType.ModeOutput, 2);
    data.writeUInt8(portType, 3);
    data.writeUInt8(modeType, 4);
    data.writeUInt32LE(valueReportInterval, 5);
    data.writeUInt8(valueReportEnabled ? 1 : 0, 9);
  }
}
