import {MessageType, ModeInfoType} from '../../types';
import {PortMessage} from '../port-message';

export class ModeInfoOutput extends PortMessage {
  public constructor(
    public readonly portType: number,
    public readonly modeType: number,
    public readonly modeInfoType: ModeInfoType
  ) {
    super(Buffer.alloc(6));

    const {data} = this;

    data.writeUInt8(data.length, 0);
    data.writeUInt8(0, 1);
    data.writeUInt8(MessageType.ModeInfoOutput, 2);
    data.writeUInt8(portType, 3);
    data.writeUInt8(modeType, 4);
    data.writeUInt8(modeInfoType, 5);
  }
}
