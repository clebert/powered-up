import {SmartHubPortType} from '@powered-up/protocol';
import {external} from 'tsdi';
import {Port} from '../port';
import {Hub} from './hub';

const {A, B, RGBLight, Current, Voltage} = SmartHubPortType;

/**
 * Smart Hub 2 I/O
 *
 * Part: 6253628
 * Design: 28738
 *
 * https://rebrickable.com/parts/6253628
 */
@external
export class SmartHub extends Hub {
  public static readonly hubType: number = 65;

  public static is(hub: Hub | undefined): hub is SmartHub {
    return hub instanceof SmartHub;
  }

  public readonly a = new Port(A, this);
  public readonly b = new Port(B, this);
  public readonly rgbLight = new Port(RGBLight, this);
  public readonly current = new Port(Current, this);
  public readonly voltage = new Port(Voltage, this);
}
