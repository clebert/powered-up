import {HubManager, SmartMoveRobot, SmartRobot} from '@powered-up/api';
import {autorun} from 'mobx';

const hubManager = HubManager.getSingleton();
const moveRobot = new SmartMoveRobot(hubManager);

autorun(() => {
  const {currentSensor} = moveRobot;

  if (!currentSensor) {
    return;
  }

  if (currentSensor.mode !== 'Milliamps') {
    currentSensor.setMode('Milliamps');
  } else if (currentSensor.milliamps !== undefined) {
    console.log('SmartMoveRobot milliamps:', currentSensor.milliamps);
  }
});

const robot = new SmartRobot(hubManager);

autorun(() => {
  const {currentSensor} = robot;

  if (!currentSensor) {
    return;
  }

  if (currentSensor.mode !== 'Milliamps') {
    currentSensor.setMode('Milliamps');
  } else if (currentSensor.milliamps !== undefined) {
    console.log('SmartRobot milliamps:', currentSensor.milliamps);
  }
});
