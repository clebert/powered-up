import {PropertyType} from '@powered-up/protocol';
import {autorun, computed} from 'mobx';
import {Device} from './devices';
import {Hub} from './hub';
import {HubManager} from './hub-manager';
import {Port} from './port';

export abstract class Robot<THub extends Hub> {
  public constructor(protected readonly hubManager: HubManager) {
    autorun(() => {
      const {hub} = this;

      if (hub && hub.latestError) {
        this.handleError(hub.latestError);
      }
    });
  }

  /** @computed */
  @computed
  public get buttonPressed(): boolean {
    const hub = this.hub;

    if (!hub || !hub.latestPropertyInput) {
      return false;
    }

    const {propertyType, propertyUpdate} = hub.latestPropertyInput;

    if (
      propertyType === PropertyType.Button &&
      propertyUpdate &&
      propertyUpdate.kind === 'button'
    ) {
      return propertyUpdate.button;
    }

    return false;
  }

  /** @computed */
  @computed
  protected get hub(): THub | undefined {
    const hub = this.findHub();

    if (!hub || !hub.connected) {
      return;
    }

    return hub;
  }

  protected getDevice<TDevice extends Device>(
    portSelector: (hub: THub) => Port,
    devicePredicate: (device?: Device) => device is TDevice
  ): TDevice | undefined {
    const hub = this.hub;

    if (!hub) {
      return;
    }

    const {device} = portSelector(hub);

    return devicePredicate(device) ? device : undefined;
  }

  protected handleError(error: Error): void {
    setImmediate(() => {
      throw error;
    });
  }

  protected observeDeviceError(deviceSelector: () => Device | undefined): void {
    autorun(() => {
      const device = deviceSelector();

      if (device && device.latestError) {
        this.handleError(device.latestError);
      }
    });
  }

  protected abstract findHub(): THub | undefined;
}
