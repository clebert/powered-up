import {SmartMoveRobot, SmartRobot} from '@powered-up/api';
import {autorun} from 'mobx';

const moveRobot = new SmartMoveRobot();

autorun(() => {
  console.log('SmartMoveRobot button pressed:', moveRobot.buttonPressed);
});

const robot = new SmartRobot();

autorun(() => {
  console.log('SmartRobot button pressed:', robot.buttonPressed);
});
