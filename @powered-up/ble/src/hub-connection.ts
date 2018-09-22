import {Input, Output, parseInput} from '@powered-up/protocol';
import {action, autorun, computed, observable} from 'mobx';
import {Characteristic, Peripheral, Service} from 'noble';
import {BLEManager} from './ble-manager';
import {debug} from './debug';

export class HubConnection {
  public readonly hubId: string;
  public readonly hubType: number;

  @observable
  public latestError?: Error;

  @observable
  public latestInput?: Input;

  @observable
  private characteristic?: Characteristic;

  @observable
  private connected = false;

  public constructor(
    private readonly peripheral: Peripheral,
    bleManager: BLEManager
  ) {
    this.hubId = peripheral.id;
    this.hubType = peripheral.advertisement.manufacturerData.readUInt8(3);

    const {localName} = peripheral.advertisement;

    this.debug('Hub discovered:', JSON.stringify(localName));

    peripheral.on('connect', this.handleConnect.bind(this));
    peripheral.on('disconnect', this.handleDisconnect.bind(this));

    autorun(() => {
      if (bleManager.ready && !this.connected) {
        this.peripheral.connect();
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
    debug(`${this.hubId}:${this.hubType}`, ...args);
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

      if (!this.characteristic) {
        this.peripheral.discoverSomeServicesAndCharacteristics(
          [],
          ['000016241212efde1623785feabcd123'],
          this.handleDiscovery.bind(this)
        );
      }
    }
  }

  @action
  private handleDisconnect(error: Error | null): void {
    if (error) {
      this.latestError = error;
    }

    if (this.characteristic) {
      this.characteristic.removeAllListeners('data');

      this.characteristic = undefined;
    }

    if (this.connected) {
      this.connected = false;
    }
  }
}
