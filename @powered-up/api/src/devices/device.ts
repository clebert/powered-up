import {Output} from '@powered-up/protocol';
import {action, observable} from 'mobx';
import {interrupt} from '../interrupt';
import {Port} from '../port';

export abstract class Device {
  @observable
  public disposed: boolean = false;

  public constructor(protected readonly port: Port) {}

  @action
  public dispose(): void {
    this.disposed = true;
  }

  protected send(output: Output): void {
    if (this.disposed) {
      interrupt(
        new Error(
          'This device has already been disposed of. Please do not store references to a device outside a reaction.'
        )
      );
    }

    this.port.hub.send(output);
  }
}
