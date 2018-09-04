import {PropertyOperationType, PropertyType} from '../../types';
import {Message} from '../message';

export interface PropertyOperationButtonState {
  kind: 'button-state';
  pressed: boolean;
}

export interface PropertyOperationVersion {
  kind: 'version';
  version: string;
}

export interface PropertyOperationRaw {
  kind: 'raw';
  raw: Buffer;
}

export type PropertyOperationPayload =
  | PropertyOperationButtonState
  | PropertyOperationRaw
  | PropertyOperationVersion;

export class PropertyInput extends Message {
  public readonly propertyType: PropertyType;
  public readonly propertyOperationType: PropertyOperationType;
  public readonly propertyOperationPayload: PropertyOperationPayload;

  public constructor(data: Buffer) {
    super(data);

    this.propertyType = data.readUInt8(3);
    this.propertyOperationType = data.readUInt8(4);

    const rawPropertyOperationPayload = data.slice(5);

    switch (this.propertyType) {
      case PropertyType.Button: {
        this.propertyOperationPayload = {
          kind: 'button-state',
          pressed: !!rawPropertyOperationPayload.readUInt8(0)
        };
        break;
      }
      case PropertyType.FirmwareVersion:
      case PropertyType.HardwareVersion: {
        // tslint:disable:no-bitwise
        const build = rawPropertyOperationPayload.readUInt16LE(0);
        const patch = rawPropertyOperationPayload.readUInt8(2);
        const minor = rawPropertyOperationPayload.readUInt8(3) & 15;
        const major = (rawPropertyOperationPayload.readUInt8(3) & 240) >> 4;
        // tslint:enable:no-bitwise

        this.propertyOperationPayload = {
          kind: 'version',
          version: `${major}.${minor}.${patch}.${build}`
        };
        break;
      }
      default: {
        this.propertyOperationPayload = {
          kind: 'raw',
          raw: rawPropertyOperationPayload
        };
      }
    }
  }
}
