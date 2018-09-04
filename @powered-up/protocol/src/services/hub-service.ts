import {PropertyOutput} from '../messages';
import {PropertyOperationType, PropertyType} from '../types';

export class HubService {
  public static enableButton(): PropertyOutput {
    return new PropertyOutput(
      PropertyType.Button,
      PropertyOperationType.EnableUpdates
    );
  }

  public static getFirmwareVersion(): PropertyOutput {
    return new PropertyOutput(
      PropertyType.FirmwareVersion,
      PropertyOperationType.RequestUpdate
    );
  }

  public static getHardwareVersion(): PropertyOutput {
    return new PropertyOutput(
      PropertyType.HardwareVersion,
      PropertyOperationType.RequestUpdate
    );
  }
}
