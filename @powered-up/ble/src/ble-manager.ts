import {IObservableArray, action, computed, observable} from 'mobx';
import noble, {Peripheral} from 'noble';

export class BLEManager {
  @observable.shallow
  public readonly peripherals: Peripheral[] = [];

  @observable
  private state = 'unknown';

  public constructor() {
    noble.on('discover', this.handleDiscovery.bind(this));
    noble.on('stateChange', this.handleStateChange.bind(this));
  }

  @computed
  public get ready(): boolean {
    return this.state === 'poweredOn';
  }

  @action
  private handleDiscovery(peripheral: Peripheral): void {
    this.peripherals.push(peripheral);
  }

  @action
  private handleStateChange(state: string): void {
    this.state = state;

    if (state === 'poweredOn') {
      noble.startScanning();
    } else {
      noble.stopScanning();

      (this.peripherals as IObservableArray<Peripheral>).clear();
    }
  }
}
