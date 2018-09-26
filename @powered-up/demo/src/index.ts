import {HubManager, SmartMoveRobot} from '@powered-up/api';
import {autorun} from 'mobx';

const hubManager = new HubManager();
const robot = new SmartMoveRobot(hubManager);

autorun(() => {
  console.log('Button pressed:', robot.buttonPressed);
});

autorun(() => {
  const {encodedMotorA, encodedMotorB} = robot;

  if (!encodedMotorA || !encodedMotorB) {
    return;
  }

  if (!encodedMotorA.busy && encodedMotorA.mode !== 'Position') {
    encodedMotorA.setMode('Position');
  }

  if (!encodedMotorB.busy && encodedMotorB.mode !== 'Position') {
    encodedMotorB.setMode('Position');
  }
});

autorun(() => {
  const {encodedMotorA, encodedMotorB} = robot;

  if (!encodedMotorA || !encodedMotorB) {
    return;
  }

  if (encodedMotorA.position !== undefined) {
    console.log('Position A:', encodedMotorA.position);
  }

  if (encodedMotorB.position !== undefined) {
    console.log('Position B:', encodedMotorB.position);
  }
});

autorun(() => {
  const {encodedMotorAB, rgbLight} = robot;

  if (!encodedMotorAB || !rgbLight) {
    return;
  }

  if (encodedMotorAB.busy) {
    rgbLight.setColor({red: 255, green: 0, blue: 0});
  } else {
    rgbLight.setColor({red: 0, green: 255, blue: 0});

    encodedMotorAB.runWithSpeedForDuration(100, 100, 1000);
  }
});
