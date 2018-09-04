import {ModeInfoFormatType, ModeInfoType} from '../../types';
import {PortMessage} from '../port-message';

export interface ModeInfoName {
  kind: 'name';
  name: string;
}

export interface ModeInfoRaw {
  kind: 'raw';
  minRaw: number;
  maxRaw: number;
}

export interface ModeInfoPct {
  kind: 'pct';
  minPct: number;
  maxPct: number;
}

export interface ModeInfoSI {
  kind: 'si';
  minSI: number;
  maxSI: number;
}

export interface ModeInfoSymbol {
  kind: 'symbol';
  symbol: string;
}

export interface ModeInfoMapping {
  kind: 'mapping';
  mappingOutput: number;
  mappingInput: number;
}

export interface ModeInfoFormat {
  kind: 'format';
  formatCount: number;
  formatType: ModeInfoFormatType;
  formatFigures: number;
  formatDecimals: number;
}

export type ModeInfo =
  | ModeInfoName
  | ModeInfoRaw
  | ModeInfoPct
  | ModeInfoSI
  | ModeInfoSymbol
  | ModeInfoMapping
  | ModeInfoFormat;

export class ModeInfoInput extends PortMessage {
  public readonly portType: number;
  public readonly modeType: number;
  public readonly modeInfoType: ModeInfoType;
  public readonly modeInfo: ModeInfo;

  public constructor(data: Buffer) {
    super(data);

    this.portType = this.parsePortType();
    this.modeType = data.readUInt8(4);
    this.modeInfoType = data.readUInt8(5);
    this.modeInfo = this.parseModeInfo();
  }

  private parseModeInfo(): ModeInfo {
    const payload = this.data.slice(6);

    switch (this.modeInfoType) {
      case ModeInfoType.Name: {
        return {kind: 'name', name: payload.toString().replace(/\0/g, '')};
      }
      case ModeInfoType.Raw: {
        return {
          kind: 'raw',
          minRaw: payload.readFloatLE(0),
          maxRaw: payload.readFloatLE(4)
        };
      }
      case ModeInfoType.Pct: {
        return {
          kind: 'pct',
          minPct: payload.readFloatLE(0),
          maxPct: payload.readFloatLE(4)
        };
      }
      case ModeInfoType.SI: {
        return {
          kind: 'si',
          minSI: payload.readFloatLE(0),
          maxSI: payload.readFloatLE(4)
        };
      }
      case ModeInfoType.Symbol: {
        return {kind: 'symbol', symbol: payload.toString().replace(/\0/g, '')};
      }
      case ModeInfoType.Mapping: {
        return {
          kind: 'mapping',
          mappingOutput: payload.readUInt8(0),
          mappingInput: payload.readUInt8(1)
        };
      }
      case ModeInfoType.Format: {
        return {
          kind: 'format',
          formatCount: payload.readUInt8(0),
          formatType: payload.readUInt8(1),
          formatFigures: payload.readUInt8(2),
          formatDecimals: payload.readUInt8(3)
        };
      }
    }
  }
}
