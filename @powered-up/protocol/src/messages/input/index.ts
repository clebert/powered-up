import {CommandInput} from './command-input';
import {DeviceInfoInput} from './device-info-input';
import {ErrorInput} from './error-input';
import {ModeInfoInput} from './mode-info-input';
import {ModeInput} from './mode-input';
import {PropertyInput} from './property-input';
import {ValueInput} from './value-input';

export * from './command-input';
export * from './device-info-input';
export * from './error-input';
export * from './mode-info-input';
export * from './mode-input';
export * from './property-input';
export * from './value-input';

export type PortInput =
  | CommandInput
  | DeviceInfoInput
  | ModeInfoInput
  | ModeInput
  | ValueInput;

export type Input = ErrorInput | PortInput | PropertyInput;
