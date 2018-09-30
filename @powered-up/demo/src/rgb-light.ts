import {HubManager, SmartMoveRobot, SmartRobot} from '@powered-up/api';
import {autorun} from 'mobx';

const hubManager = HubManager.getSingleton();
const moveRobot = new SmartMoveRobot(hubManager);

autorun(() => {
  const {rgbLight} = moveRobot;

  if (!rgbLight) {
    return;
  }

  rgbLight.setColor({red: 255, green: 0, blue: 0});
});

const robot = new SmartRobot(hubManager);

autorun(() => {
  const {rgbLight} = robot;

  if (!rgbLight) {
    return;
  }

  rgbLight.setColor({red: 0, green: 255, blue: 0});
});
