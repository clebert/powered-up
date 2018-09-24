import {autorun} from 'mobx';
import {Robot} from './robot';

const robot = new Robot();

autorun(() => {
  console.log('Button pressed:', robot.buttonPressed);
});

autorun(() => {
  const {motorA} = robot;

  if (motorA && motorA.position !== undefined) {
    console.log('Position:', motorA.position);
  }
});

autorun(() => {
  const {motorA, statusLight} = robot;

  if (!motorA || !statusLight) {
    return;
  }

  if (motorA.busy) {
    statusLight.setColor({red: 255, green: 0, blue: 0});
  } else {
    statusLight.setColor({red: 0, green: 255, blue: 0});

    if (motorA.mode !== 'Position') {
      motorA.setMode('Position');
    } else {
      motorA.runWithSpeedForDuration(100, 1000);
    }
  }
});
