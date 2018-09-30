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
  TiltSensor,
  CurrentSensor,
  VoltageSensor
} = SmartMoveHubPortType;

/**
 * - Rebrickable: https://rebrickable.com/parts/26910/
 * - BrickLink: https://www.bricklink.com/v2/catalog/catalogitem.page?P=26910c01
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
  public readonly tiltSensor = new Port(TiltSensor, this);
  public readonly currentSensor = new Port(CurrentSensor, this);
  public readonly voltageSensor = new Port(VoltageSensor, this);
}
