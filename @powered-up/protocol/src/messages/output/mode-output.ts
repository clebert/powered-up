import {MessageType} from '../../types';
import {Message} from '../message';

export class ModeOutput extends Message {
  public constructor(
    public readonly portType: number,
    public readonly modeType: number,
    public readonly valueReportThresholdDelta: number,
    public readonly valueReportEnabled: boolean
  ) {
    super(Buffer.alloc(10));

    const {data} = this;

    data.writeUInt8(data.length, 0);
    data.writeUInt8(0, 1);
    data.writeUInt8(MessageType.ModeOutput, 2);
    data.writeUInt8(portType, 3);
    data.writeUInt8(modeType, 4);
    data.writeUInt32LE(valueReportThresholdDelta, 5);
    data.writeUInt8(valueReportEnabled ? 1 : 0, 9);
  }
}
