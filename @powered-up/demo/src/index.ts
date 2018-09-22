import {
  EncodedMotor,
  HubManager,
  RGBLight,
  SmartMoveHub
} from '@powered-up/api';
import {autorun} from 'mobx';

const hubManager = new HubManager();

autorun(() => {
  const hub = hubManager.hubs.find(SmartMoveHub.is);

  if (!hub || !hub.connected) {
    return;
  }

  const rgbLight = hub.rgbLight.device;

  if (!RGBLight.is(rgbLight)) {
    return;
  }

  const encodedMotorA = hub.encodedMotorA.device;

  if (!EncodedMotor.is(encodedMotorA)) {
    return;
  }

  if (hub.encodedMotorA.busy) {
    rgbLight.setColor({red: 255, green: 0, blue: 0});
  } else {
    rgbLight.setColor({red: 0, green: 255, blue: 0});

    encodedMotorA.runWithSpeedForDuration(100, 1000);
  }
});
