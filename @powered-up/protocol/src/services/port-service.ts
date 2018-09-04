import {CommandOutput, ModeOutput} from '../messages';
import {CommandType} from '../types';

export abstract class PortService<TModeType extends number> {
  public constructor(public readonly portType: number) {}

  public setMode(modeType: TModeType): ModeOutput {
    return new ModeOutput(this.portType, modeType, 1, true);
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
