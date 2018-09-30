import {SmartHubPortType} from '@powered-up/protocol';
import {Hub} from './hub';
import {Port} from './port';

const {A, B, RGBLight, CurrentSensor, VoltageSensor} = SmartHubPortType;

/**
 * - Rebrickable: https://rebrickable.com/parts/6253628/
 * - BrickLink: https://www.bricklink.com/v2/catalog/catalogitem.page?P=28738c01
 */
export class SmartHub extends Hub {
  public static readonly hubType: number = 65;

  public static is(hub: Hub): hub is SmartHub {
    return hub instanceof SmartHub;
  }

  public readonly a = new Port(A, this);
  public readonly b = new Port(B, this);
  public readonly rgbLight = new Port(RGBLight, this);
  public readonly currentSensor = new Port(CurrentSensor, this);
  public readonly voltageSensor = new Port(VoltageSensor, this);
}
