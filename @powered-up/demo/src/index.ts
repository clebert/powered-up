import {
  EncodedMotor,
  HubManager,
  RGBLight,
  SmartMoveHub
} from '@powered-up/api';
import {autorun, computed} from 'mobx';

function interrupt(error: Error): void {
  setImmediate(() => {
    throw error;
  });
}

const hubManager = new HubManager();

const smartMoveHubValue = computed(() => {
  const smartMoveHub = hubManager.hubs.find(SmartMoveHub.is);

  if (!smartMoveHub || !smartMoveHub.connected) {
    return;
  }

  if (smartMoveHub.latestError) {
    interrupt(smartMoveHub.latestError);
  }

  return smartMoveHub;
});

const encodedMotorAValue = computed(() => {
  const smartMoveHub = smartMoveHubValue.get();

  if (!smartMoveHub) {
    return;
  }

  const encodedMotorA = smartMoveHub.encodedMotorA.device;

  if (!EncodedMotor.is(encodedMotorA)) {
    return;
  }

  if (encodedMotorA.latestError) {
    interrupt(encodedMotorA.latestError);
  }

  return encodedMotorA;
});

const rgbLightValue = computed(() => {
  const smartMoveHub = smartMoveHubValue.get();

  if (!smartMoveHub) {
    return;
  }

  const rgbLight = smartMoveHub.rgbLight.device;

  if (!RGBLight.is(rgbLight)) {
    return;
  }

  if (rgbLight.latestError) {
    interrupt(rgbLight.latestError);
  }

  return rgbLight;
});

autorun(() => {
  const smartMoveHub = smartMoveHubValue.get();

  if (!smartMoveHub) {
    return;
  }

  console.log('Button pressed:', smartMoveHub.buttonPressed);
});

autorun(() => {
  const encodedMotorA = encodedMotorAValue.get();

  if (!encodedMotorA) {
    return;
  }

  if (encodedMotorA.position !== undefined) {
    console.log('Position:', encodedMotorA.position);
  }
});

autorun(() => {
  const encodedMotorA = encodedMotorAValue.get();
  const rgbLight = rgbLightValue.get();

  if (!encodedMotorA || !rgbLight) {
    return;
  }

  if (encodedMotorA.busy) {
    rgbLight.setColor({red: 255, green: 0, blue: 0});
  } else {
    rgbLight.setColor({red: 0, green: 255, blue: 0});

    if (encodedMotorA.mode !== 'Position') {
      encodedMotorA.setMode('Position');
    } else {
      encodedMotorA.runWithSpeedForDuration(100, 1000);
    }
  }
});
