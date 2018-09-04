import {EncodedMotor, SmartMoveHub, hubManager} from '@powered-up/sdk';
import {autorun} from 'mobx';

function getSmartMoveHub(): SmartMoveHub | undefined {
  const hub = hubManager.hubs.find(SmartMoveHub.is);

  if (!hub || !hub.ready) {
    return;
  }

  return hub;
}

function getEncodedMotorA(): EncodedMotor | undefined {
  const hub = getSmartMoveHub();

  if (!hub) {
    return;
  }

  return EncodedMotor.connectTo(hub.encodedMotorA);
}

autorun(() => {
  const hub = getSmartMoveHub();

  if (!hub) {
    return;
  }

  console.log('ButtonPressed', hub.buttonPressed);
});

autorun(() => {
  const encodedMotorA = getEncodedMotorA();

  if (!encodedMotorA) {
    return;
  }

  if (encodedMotorA.mode !== 'Speed') {
    encodedMotorA.setMode('Speed');

    return;
  }

  if (encodedMotorA.speed !== undefined) {
    console.log('Speed', encodedMotorA.speed);
  }

  if (!encodedMotorA.port.busy) {
    encodedMotorA.runWithSpeedForDuration(100, 1000);
  }
});
