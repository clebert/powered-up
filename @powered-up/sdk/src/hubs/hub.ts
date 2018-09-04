import {
  ErrorInput,
  ErrorType,
  HubService,
  Message,
  MessageType,
  PortMessage,
  PropertyInput,
  PropertyType,
  parseInput
} from '@powered-up/protocol';
import {action, autorun, computed, observable, reaction} from 'mobx';
import {Characteristic, Peripheral, Service} from 'noble';
import {initialize, inject} from 'tsdi';
import {Bluetooth} from '../bluetooth';
import {debug, interrupt} from '../utils';

const bluetoothCharacteristicUuid = '000016241212efde1623785feabcd123';

export abstract class Hub {
  public readonly id: string;
  public readonly name: string;

  @observable
  public buttonPressed: boolean = false;

  @observable
  public firmwareVersion?: string;

  @observable
  public hardwareVersion?: string;

  @observable
  public latestPortInput?: PortMessage;

  @inject
  private readonly bluetooth!: Bluetooth;

  @observable
  private characteristic?: Characteristic;

  @observable
  private connected = false;

  public constructor(private readonly peripheral: Peripheral) {
    this.id = peripheral.id;
    this.name = peripheral.advertisement.localName;

    this.debug('Hub discovered:', JSON.stringify(this.name));

    peripheral.on('connect', this.handleConnect.bind(this));
    peripheral.on('disconnect', this.handleDisconnect.bind(this));
  }

  @initialize
  public init(): void {
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

    autorun(() => {
      if (this.ready) {
        this.send(HubService.enableButton());
      }
    });
  }

  @computed
  public get ready(): boolean {
    return (
      this.connected &&
      this.characteristic !== undefined &&
      this.firmwareVersion !== undefined &&
      this.hardwareVersion !== undefined &&
      this.latestPortInput !== undefined
    );
  }

  @action
  public send(output: Message): boolean {
    const {characteristic} = this;

    if (!characteristic) {
      this.debug('Unable to send message:', output);

      return false;
    }

    this.debug('Send message:', output);

    characteristic.write(output.data, true);

    return true;
  }

  @action
  private handleDiscovery(
    _error: never,
    _services: Service[],
    characteristics: Characteristic[]
  ): void {
    this.characteristic = characteristics[0];

    this.characteristic.on('data', this.handleData.bind(this));
    this.characteristic.subscribe(interrupt);

    this.fetchFirmwareVersion();
    this.fetchHardwareVersion();
  }

  @action
  private handleData(data: Buffer): void {
    try {
      const input = parseInput(data);

      if (input) {
        this.debug('Message received:', input);

        if (input instanceof ErrorInput) {
          const {errorCausingMessageType, errorType} = input;

          const messageName = `${
            MessageType[errorCausingMessageType]
          }(${errorCausingMessageType})`;

          const errorName = `${ErrorType[errorType]}(${errorType})`;

          interrupt(
            new Error(`${errorName} error caused by ${messageName} message.`)
          );
        } else if (input instanceof PropertyInput) {
          const {propertyType, propertyOperationPayload} = input;

          if (
            propertyType === PropertyType.FirmwareVersion &&
            propertyOperationPayload.kind === 'version'
          ) {
            this.firmwareVersion = propertyOperationPayload.version;
          } else if (
            input.propertyType === PropertyType.HardwareVersion &&
            propertyOperationPayload.kind === 'version'
          ) {
            this.hardwareVersion = propertyOperationPayload.version;
          } else if (
            input.propertyType === PropertyType.Button &&
            propertyOperationPayload.kind === 'button-state'
          ) {
            this.buttonPressed = propertyOperationPayload.pressed;
          }
        } else {
          this.latestPortInput = input;
        }
      } else {
        this.debug('Unknown message received:', data);
      }
    } catch (error) {
      interrupt(error);
    }
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
    interrupt(error);

    this.connected = false;

    if (this.characteristic) {
      this.characteristic.removeAllListeners('data');
      this.characteristic.unsubscribe(interrupt);

      this.characteristic = undefined;
    }

    this.buttonPressed = false;
    this.firmwareVersion = undefined;
    this.hardwareVersion = undefined;
    this.latestPortInput = undefined;
  }

  // tslint:disable-next-line:no-any
  private debug(...args: any[]): void {
    debug(this.constructor.name, this.id, ...args);
  }

  private fetchFirmwareVersion(): void {
    if (this.firmwareVersion) {
      return;
    }

    const intervalId = setInterval(() => {
      if (this.characteristic) {
        this.send(HubService.getFirmwareVersion());
      }
    }, 100);

    reaction(
      () => this.firmwareVersion,
      (firmwareVersion, ctx) => {
        if (firmwareVersion) {
          clearInterval(intervalId);
          ctx.dispose();
        }
      }
    );
  }

  private fetchHardwareVersion(): void {
    if (this.hardwareVersion) {
      return;
    }

    const intervalId = setInterval(() => {
      if (this.characteristic) {
        this.send(HubService.getHardwareVersion());
      }
    }, 100);

    reaction(
      () => this.hardwareVersion,
      (hardwareVersion, ctx) => {
        if (hardwareVersion) {
          clearInterval(intervalId);
          ctx.dispose();
        }
      }
    );
  }
}
