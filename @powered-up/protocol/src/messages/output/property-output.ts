import {MessageType, PropertyOperationType, PropertyType} from '../../types';
import {Message} from '../message';

export class PropertyOutput extends Message {
  public constructor(
    public readonly propertyType: PropertyType,
    public readonly propertyOperationType: PropertyOperationType,
    public readonly propertyOperationPayload: Buffer = Buffer.from([])
  ) {
    super(Buffer.alloc(propertyOperationPayload.length + 5));

    const {data} = this;

    data.writeUInt8(data.length, 0);
    data.writeUInt8(0, 1);
    data.writeUInt8(MessageType.PropertyInputOutput, 2);
    data.writeUInt8(propertyType, 3);
    data.writeUInt8(propertyOperationType, 4);
    data.fill(propertyOperationPayload, 5);
  }
}
