// tslint:disable:no-unbound-method

import {Input, Output, parseInput} from '@powered-up/protocol';
import {action, autorun, computed, observable} from 'mobx';
import {Characteristic, Peripheral, Service} from 'noble';
import {BLEManager} from './ble-manager';
import {debug} from './utils/debug';

export class HubConnection {
  public readonly hubId: string;
  public readonly hubName: string;
  public readonly hubType: number;

  /** @observable */
  @observable
  public latestError?: Error;

  /** @observable */
  @observable
  public latestInput?: Input;

  /** @observable */
  @observable
  private characteristic?: Characteristic;

  /** @observable */
  @observable
  private connected = false;

  public constructor(
    private readonly peripheral: Peripheral,
    bleManager: BLEManager
  ) {
    this.hubId = peripheral.id;
    this.hubName = peripheral.advertisement.localName;
    this.hubType = peripheral.advertisement.manufacturerData.readUInt8(3);

    this.debug('Hub discovered:', JSON.stringify(this.hubName));

    peripheral.on('connect', this.handleConnect);
    peripheral.on('disconnect', this.handleDisconnect);

    autorun(() => {
      if (bleManager.ready && !this.connected) {
        this.peripheral.connect();
      }
    });
  }

  /** @computed */
  @computed
  public get ready(): boolean {
    return this.connected && this.characteristic !== undefined;
  }

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

  @action.bound
  private handleData(data: Buffer): void {
    const input = (this.latestInput = parseInput(data));

    if (input) {
      this.debug('Message received:', input);
    } else {
      this.debug('Unknown message received:', data);
    }
  }

  @action.bound
  private handleDiscovery(
    _error: never,
    _services: Service[],
    characteristics: Characteristic[]
  ): void {
    this.characteristic = characteristics[0];

    this.characteristic.on('data', this.handleData);
    this.characteristic.subscribe(this.handleError);
  }

  @action.bound
  private handleConnect(error: Error | null): void {
    if (error) {
      this.handleError(error);
    } else {
      this.connected = true;

      this.debug('Hub connected:', JSON.stringify(this.hubName));

      if (!this.characteristic) {
        this.peripheral.discoverSomeServicesAndCharacteristics(
          [],
          ['000016241212efde1623785feabcd123'],
          this.handleDiscovery
        );
      }
    }
  }

  @action.bound
  private handleDisconnect(error: Error | null): void {
    if (error) {
      this.latestError = error;
    }

    if (this.characteristic) {
      this.characteristic.removeAllListeners('data');
      this.characteristic.unsubscribe(this.handleError);

      this.characteristic = undefined;
    }

    if (this.connected) {
      this.connected = false;

      this.debug('Hub disconnected:', JSON.stringify(this.hubName));
    }
  }

  @action.bound
  private handleError(error: Error | null): void {
    if (error) {
      this.handleDisconnect(error);
    }
  }
}
