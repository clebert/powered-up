import {Input, Output, parseInput} from '@powered-up/protocol';
import {action, autorun, computed, observable} from 'mobx';
import {Characteristic, Peripheral, Service} from 'noble';
import {Bluetooth} from './bluetooth';
import {debug} from './debug';

const bluetoothCharacteristicUuid = '000016241212efde1623785feabcd123';

export class Device {
  public readonly id: string;

  @observable
  public latestError?: Error;

  @observable
  public latestInput?: Input;

  @observable
  private characteristic?: Characteristic;

  @observable
  private connected = false;

  public constructor(
    private readonly bluetooth: Bluetooth,
    private readonly peripheral: Peripheral
  ) {
    this.id = peripheral.id;

    const {localName} = peripheral.advertisement;

    this.debug('LEGO device discovered:', JSON.stringify(localName));

    peripheral.on('connect', this.handleConnect.bind(this));
    peripheral.on('disconnect', this.handleDisconnect.bind(this));

    autorun(() => {
      if (!this.bluetooth.ready) {
        return;
      }

      if (!this.connected) {
        this.peripheral.connect();
      } else {
        this.peripheral.discoverSomeServicesAndCharacteristics(
          [],
          [bluetoothCharacteristicUuid],
          this.handleDiscovery.bind(this)
        );
      }
    });
  }

  @computed
  public get ready(): boolean {
    return this.connected && this.characteristic !== undefined;
  }

  @action
  public send(output: Output): boolean {
    const {characteristic} = this;

    if (!characteristic) {
      this.debug('Unable to send message:', output);

      return false;
    }

    this.debug('Send message:', output);

    characteristic.write(output.data, true);

    return true;
  }

  private debug(...args: unknown[]): void {
    debug(this.constructor.name, this.id, ...args);
  }

  @action
  private handleData(data: Buffer): void {
    const input = (this.latestInput = parseInput(data));

    if (input) {
      this.debug('Message received:', input);
    } else {
      this.debug('Unknown message received:', data);
    }
  }

  @action
  private handleDiscovery(
    _error: never,
    _services: Service[],
    characteristics: Characteristic[]
  ): void {
    this.characteristic = characteristics[0];

    this.characteristic.on('data', this.handleData.bind(this));
  }

  @action
  private handleConnect(error: Error | null): void {
    if (error) {
      this.handleDisconnect(error);
    } else {
      this.connected = true;
    }
  }

  @action
  private handleDisconnect(error: Error | null): void {
    this.connected = false;

    if (this.characteristic) {
      this.characteristic.removeAllListeners('data');

      this.characteristic = undefined;
    }

    if (error) {
      this.latestError = error;
    }
  }
}
