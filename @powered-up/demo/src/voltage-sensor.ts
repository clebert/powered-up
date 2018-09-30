import {HubManager, SmartMoveRobot, SmartRobot} from '@powered-up/api';
import {autorun} from 'mobx';

const hubManager = HubManager.getSingleton();
const moveRobot = new SmartMoveRobot(hubManager);

autorun(() => {
  const {voltageSensor} = moveRobot;

  if (!voltageSensor) {
    return;
  }

  if (voltageSensor.mode !== 'Millivolts') {
    voltageSensor.setMode('Millivolts');
  } else if (voltageSensor.millivolts !== undefined) {
    console.log('SmartMoveRobot millivolts:', voltageSensor.millivolts);
  }
});

const robot = new SmartRobot(hubManager);

autorun(() => {
  const {voltageSensor} = robot;

  if (!voltageSensor) {
    return;
  }

  if (voltageSensor.mode !== 'Millivolts') {
    voltageSensor.setMode('Millivolts');
  } else if (voltageSensor.millivolts !== undefined) {
    console.log('SmartRobot millivolts:', voltageSensor.millivolts);
  }
});
