import {Port} from '../port';

export abstract class Device {
  protected constructor(public readonly port: Port) {}
}
