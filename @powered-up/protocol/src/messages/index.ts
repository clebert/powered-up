import {MessageType} from '../types';
import {
  CommandInput,
  DeviceInfoInput,
  ErrorInput,
  Input,
  ModeInfoInput,
  ModeInput,
  PropertyInput,
  ValueInput
} from './input';

export * from './input';
export * from './message';
export * from './output';

export function parseInput(data: Buffer): Input | undefined {
  switch (data.readUInt8(2)) {
    case MessageType.ErrorInput: {
      return new ErrorInput(data);
    }
    case MessageType.PropertyInputOutput: {
      return new PropertyInput(data);
    }
    case MessageType.CommandInput: {
      return new CommandInput(data);
    }
    case MessageType.DeviceInfoInput: {
      return new DeviceInfoInput(data);
    }
    case MessageType.ModeInfoInput: {
      return new ModeInfoInput(data);
    }
    case MessageType.ModeInput: {
      return new ModeInput(data);
    }
    case MessageType.ValueInput: {
      return new ValueInput(data);
    }
    default: {
      return;
    }
  }
}
