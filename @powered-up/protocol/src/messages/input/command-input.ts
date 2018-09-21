import {Message} from '../message';

export class CommandInput extends Message {
  public readonly portType: number;
  public readonly portBusy: boolean;
  public readonly portBufferFull: boolean;
  public readonly commandCompleted: boolean;
  public readonly commandDiscarded: boolean;

  public constructor(data: Buffer) {
    super(data);

    this.portType = data.readUInt8(3);

    switch (data.readUInt8(4)) {
      case 1: {
        this.portBusy = true;
        this.portBufferFull = false;
        this.commandCompleted = false;
        this.commandDiscarded = false;
        break;
      }
      case 3: {
        this.portBusy = true;
        this.portBufferFull = false;
        this.commandCompleted = true;
        this.commandDiscarded = false;
        break;
      }
      case 5: {
        this.portBusy = true;
        this.portBufferFull = false;
        this.commandCompleted = false;
        this.commandDiscarded = true;
        break;
      }
      case 10: {
        this.portBusy = false;
        this.portBufferFull = false;
        this.commandCompleted = true;
        this.commandDiscarded = false;
        break;
      }
      case 12: {
        this.portBusy = false;
        this.portBufferFull = false;
        this.commandCompleted = false;
        this.commandDiscarded = true;
        break;
      }
      case 14: {
        this.portBusy = false;
        this.portBufferFull = false;
        this.commandCompleted = true;
        this.commandDiscarded = true;
        break;
      }
      case 16: {
        this.portBusy = true;
        this.portBufferFull = true;
        this.commandCompleted = false;
        this.commandDiscarded = false;
        break;
      }
      default: {
        throw new Error('Unexpected command feedback.');
      }
    }
  }
}
