import {PropertyOperationType, PropertyType} from '../../types';
import {Message} from '../message';

export interface PropertyUpdateButton {
  kind: 'button';
  pressed: boolean;
}

export interface PropertyUpdateVersion {
  kind: 'version';
  version: string;
}

export type PropertyUpdate = PropertyUpdateButton | PropertyUpdateVersion;

export class PropertyInput extends Message {
  public readonly propertyType: PropertyType;
  public readonly propertyOperationType: PropertyOperationType;
  public readonly propertyUpdate?: PropertyUpdate;

  public constructor(data: Buffer) {
    super(data);

    this.propertyType = data.readUInt8(3);
    this.propertyOperationType = data.readUInt8(4);

    if (this.propertyOperationType === PropertyOperationType.Update) {
      this.propertyUpdate = this.parsePropertyUpdate();
    }
  }

  private parsePropertyUpdate(): PropertyUpdate | undefined {
    const rawPropertyState = this.data.slice(5);

    switch (this.propertyType) {
      case PropertyType.Button: {
        return {
          kind: 'button',
          pressed: !!rawPropertyState.readUInt8(0)
        };
      }
      case PropertyType.FirmwareVersion:
      case PropertyType.HardwareVersion: {
        // tslint:disable:no-bitwise
        const build = rawPropertyState.readUInt16LE(0);
        const patch = rawPropertyState.readUInt8(2);
        const minor = rawPropertyState.readUInt8(3) & 15;
        const major = (rawPropertyState.readUInt8(3) & 240) >> 4;
        // tslint:enable:no-bitwise

        return {
          kind: 'version',
          version: `${major}.${minor}.${patch}.${build}`
        };
      }
      default: {
        return;
      }
    }
  }
}
