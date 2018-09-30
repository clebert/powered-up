import {HubManager, SmartMoveRobot, SmartRobot} from '@powered-up/api';
import {autorun} from 'mobx';

const hubManager = HubManager.getSingleton();
const moveRobot = new SmartMoveRobot(hubManager);

autorun(() => {
  const {motorC} = moveRobot;

  if (!motorC) {
    return;
  }

  if (!motorC.busy) {
    motorC.runWithPower(100);
  }
});

const robot = new SmartRobot(hubManager);

autorun(() => {
  const {motorA} = robot;

  if (!motorA) {
    return;
  }

  if (!motorA.busy) {
    motorA.runWithPower(100);
  }
});
