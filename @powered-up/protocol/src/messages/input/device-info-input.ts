import {DeviceType} from '../../types';
import {PortMessage} from '../port-message';

export interface RealDeviceInfo {
  kind: 'real';
  deviceType: DeviceType;
}

export interface VirtualDeviceInfo {
  kind: 'virtual';
  deviceType: DeviceType;
  mappedPortTypes: [number, number];
}

export type DeviceInfo = RealDeviceInfo | VirtualDeviceInfo;

export class DeviceInfoInput extends PortMessage {
  public readonly portType: number;
  public readonly deviceInfo?: DeviceInfo;

  public constructor(data: Buffer) {
    super(data);

    this.portType = this.parsePortType();

    const deviceInfoType = data.readUInt8(4);

    if (deviceInfoType > 0) {
      const deviceType = data.readUInt16LE(5);

      if (deviceInfoType === 1) {
        this.deviceInfo = {kind: 'real', deviceType};
      } else if (deviceInfoType === 2) {
        this.deviceInfo = {
          kind: 'virtual',
          deviceType,
          mappedPortTypes: [data.readUInt8(7), data.readUInt8(8)]
        };
      }
    }
  }
}
