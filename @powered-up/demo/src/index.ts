import {HubManager, SmartMoveRobot} from '@powered-up/api';
import {autorun} from 'mobx';

const hubManager = new HubManager();
const robot = new SmartMoveRobot(hubManager);

autorun(() => {
  console.log('Button pressed:', robot.buttonPressed);
});

autorun(() => {
  const {encodedMotorA} = robot;

  if (encodedMotorA && encodedMotorA.position !== undefined) {
    console.log('Position:', encodedMotorA.position);
  }
});

autorun(() => {
  const {encodedMotorA, rgbLight} = robot;

  if (!encodedMotorA || !rgbLight) {
    return;
  }

  if (encodedMotorA.busy) {
    rgbLight.setColor({red: 255, green: 0, blue: 0});
  } else {
    rgbLight.setColor({red: 0, green: 255, blue: 0});

    if (encodedMotorA.mode !== 'Position') {
      encodedMotorA.setMode('Position');
    } else {
      encodedMotorA.runWithSpeedForDuration(100, 1000);
    }
  }
});
