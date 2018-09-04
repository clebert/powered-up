import {ErrorType} from '../../types';
import {Message} from '../message';

export class ErrorInput extends Message {
  public readonly errorCausingMessageType: number;
  public readonly errorType: ErrorType;

  public constructor(data: Buffer) {
    super(data);

    this.errorCausingMessageType = data.readUInt8(3);
    this.errorType = data.readUInt8(4);
  }
}
