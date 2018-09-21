import {Message} from '../message';

export class ModeInput extends Message {
  public readonly portType: number;
  public readonly modeType: number;
  public readonly valueReportInterval: number;
  public readonly valueReportEnabled: boolean;

  public constructor(data: Buffer) {
    super(data);

    this.portType = data.readUInt8(3);
    this.modeType = data.readUInt8(4);
    this.valueReportInterval = data.readUInt32LE(5);
    this.valueReportEnabled = !!data.readUInt8(9);
  }
}
