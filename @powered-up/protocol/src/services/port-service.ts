import {CommandOutput, ModeOutput} from '../messages';
import {CommandType} from '../types';

export abstract class PortService<TModeType extends number> {
  public constructor(public readonly portType: number) {}

  public setMode(
    modeType: TModeType,
    valueReportThresholdDelta: number,
    valueReportEnabled: boolean
  ): ModeOutput {
    return new ModeOutput(
      this.portType,
      modeType,
      valueReportThresholdDelta,
      valueReportEnabled
    );
  }

  protected executeCommand(
    commandType: CommandType,
    commandPayload: Buffer
  ): CommandOutput {
    return new CommandOutput(this.portType, true, commandType, commandPayload);
  }

  protected setValueForMode(modeType: TModeType, value: Buffer): CommandOutput {
    const commandPayload = Buffer.alloc(value.length + 1);

    commandPayload.writeUInt8(modeType, 0);
    commandPayload.fill(value, 1);

    return new CommandOutput(
      this.portType,
      true,
      CommandType.SetValueForMode,
      commandPayload
    );
  }
}
