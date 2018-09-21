declare module 'noble' {
  import {EventEmitter} from 'events';

  namespace noble {
    type Listener<TPayload> = (payload: TPayload) => void;

    type NobleEvent = 'discover' | 'stateChange';

    interface Characteristic extends EventEmitter {
      subscribe(callback: (error: Error | null) => void): void;
      unsubscribe(callback: (error: Error | null) => void): void;
      write(data: Buffer, withoutResponse: boolean): void;
    }

    type PeripheralEvent = 'connect' | 'disconnect';

    interface Peripheral extends EventEmitter {
      id: string;

      advertisement: {
        localName: string;
        manufacturerData: Buffer;
        serviceUuids: string[];
      };

      connect(): void;

      discoverSomeServicesAndCharacteristics(
        serviceUuids: string[],
        characteristicsUuids: string[],
        callback: (
          error: never,
          services: Service[],
          characteristics: Characteristic[]
        ) => void
      ): void;
    }

    interface Service {}
  }

  class Noble extends EventEmitter {
    public startScanning(
      serviceUuids?: string[],
      allowDuplicates?: boolean
    ): void;

    public stopScanning(): void;
  }

  const noble: Noble;

  export = noble;
}
