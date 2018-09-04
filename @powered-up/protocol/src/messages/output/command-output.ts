import {CommandType, MessageType} from '../../types';
import {PortMessage} from '../port-message';

export class CommandOutput extends PortMessage {
  public constructor(
    public readonly portType: number,
    public readonly executeImmediately: boolean /* bufferIfNecessary === false */,
    public readonly commandType: CommandType,
    public readonly commandPayload: Buffer
  ) {
    super(Buffer.alloc(commandPayload.length + 6));

    const {data} = this;

    data.writeUInt8(data.length, 0);
    data.writeUInt8(0, 1);
    data.writeUInt8(MessageType.CommandOutput, 2);
    data.writeUInt8(portType, 3);
    // tslint:disable-next-line:no-bitwise
    data.writeUInt8(((executeImmediately ? 1 : 0) << 4) | 1, 4);
    data.writeUInt8(commandType, 5);
    data.fill(commandPayload, 6);
  }
}
