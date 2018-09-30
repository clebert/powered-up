import {SmartMoveRobot, SmartRobot} from '@powered-up/api';
import {autorun} from 'mobx';

const moveRobot = new SmartMoveRobot();

autorun(() => {
  const {motorC} = moveRobot;

  if (!motorC) {
    return;
  }

  if (!motorC.busy) {
    motorC.runWithPower(100);
  }
});

const robot = new SmartRobot();

autorun(() => {
  const {motorA} = robot;

  if (!motorA) {
    return;
  }

  if (!motorA.busy) {
    motorA.runWithPower(100);
  }
});
