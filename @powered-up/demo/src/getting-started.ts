import {SmartMoveRobot} from '@powered-up/api';
import {autorun} from 'mobx';

const moveRobot = new SmartMoveRobot();

autorun(() => {
  const {buttonPressed, encodedMotorA, rgbLight} = moveRobot;

  if (!encodedMotorA || !rgbLight) {
    return;
  }

  if (buttonPressed) {
    rgbLight.setColor({red: 0, green: 255, blue: 0});

    encodedMotorA.runWithPower(100);
  } else {
    rgbLight.setColor({red: 255, green: 0, blue: 0});

    encodedMotorA.brake();
  }
});
