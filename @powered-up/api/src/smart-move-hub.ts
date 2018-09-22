import {SmartMoveHubPortType} from '@powered-up/protocol';
import {Hub} from './hub';
import {Port} from './port';

const {
  C,
  D,
  RGBLight,
  EncodedMotorA,
  EncodedMotorB,
  EncodedMotorAB,
  TiltSensorThreeAxis,
  Current,
  Voltage
} = SmartMoveHubPortType;

/**
 * Smart Move Hub 2 I/O
 *
 * Part: 6182144
 * Design: 26910
 *
 * https://rebrickable.com/parts/26910
 */
export class SmartMoveHub extends Hub {
  public static readonly hubType: number = 64;

  public static is(hub: Hub): hub is SmartMoveHub {
    return hub instanceof SmartMoveHub;
  }

  public readonly c = new Port(C, this);
  public readonly d = new Port(D, this);
  public readonly rgbLight = new Port(RGBLight, this);
  public readonly encodedMotorA = new Port(EncodedMotorA, this);
  public readonly encodedMotorB = new Port(EncodedMotorB, this);
  public readonly encodedMotorAB = new Port(EncodedMotorAB, this);
  public readonly tiltSensorThreeAxis = new Port(TiltSensorThreeAxis, this);
  public readonly current = new Port(Current, this);
  public readonly voltage = new Port(Voltage, this);
}
