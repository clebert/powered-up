import {HubManager, SmartMoveRobot, SmartRobot} from '@powered-up/api';
import {autorun} from 'mobx';

const hubManager = HubManager.getSingleton();
const moveRobot = new SmartMoveRobot(hubManager);

autorun(() => {
  console.log('SmartMoveRobot button pressed:', moveRobot.buttonPressed);
});

const robot = new SmartRobot(hubManager);

autorun(() => {
  console.log('SmartRobot button pressed:', robot.buttonPressed);
});
