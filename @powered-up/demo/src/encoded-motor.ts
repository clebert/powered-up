import {SmartMoveRobot} from '@powered-up/api';
import {autorun} from 'mobx';

const moveRobot = new SmartMoveRobot();

autorun(() => {
  const {encodedMotorA} = moveRobot;

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
  const {encodedMotorC} = moveRobot;

  if (!encodedMotorC) {
    return;
  }

  if (!encodedMotorC.busy && encodedMotorC.mode !== 'Speed') {
    encodedMotorC.setMode('Speed');
  } else if (encodedMotorC.speed !== undefined) {
    console.log('Speed C:', encodedMotorC.speed);
  }
});

autorun(() => {
  const {encodedMotorA} = moveRobot;

  if (!encodedMotorA) {
    return;
  }

  if (!encodedMotorA.busy) {
    encodedMotorA.runWithPower(100);
  }
});

autorun(() => {
  const {encodedMotorC} = moveRobot;

  if (!encodedMotorC) {
    return;
  }

  if (!encodedMotorC.busy) {
    encodedMotorC.runWithSpeedForDuration(100, 1000);
  }
});
