import {HubManager, SmartMoveRobot} from '@powered-up/api';
import {autorun} from 'mobx';

const hubManager = HubManager.getSingleton();
const robot = new SmartMoveRobot(hubManager);

autorun(() => {
  const {encodedMotorA} = robot;

  if (!encodedMotorA) {
    return;
  }

  if (!encodedMotorA.busy && encodedMotorA.mode !== 'Position') {
    encodedMotorA.setMode('Position');
  } else if (encodedMotorA.position !== undefined) {
    console.log('Position A:', encodedMotorA.position);
  }
});

autorun(() => {
  const {encodedMotorB} = robot;

  if (!encodedMotorB) {
    return;
  }

  if (!encodedMotorB.busy && encodedMotorB.mode !== 'Position') {
    encodedMotorB.setMode('Position');
  } else if (encodedMotorB.position !== undefined) {
    console.log('Position B:', encodedMotorB.position);
  }
});

autorun(() => {
  const {encodedMotorAB} = robot;

  if (!encodedMotorAB) {
    return;
  }

  if (!encodedMotorAB.busy) {
    encodedMotorAB.runWithSpeedForDuration(100, 100, 1000);
  }
});
