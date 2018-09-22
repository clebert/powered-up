import {HubManager, RGBLight, SmartMoveHub} from '@powered-up/api';
import {autorun} from 'mobx';

const hubManager = new HubManager();

autorun(() => {
  const hub = hubManager.hubs.find(SmartMoveHub.is);

  if (!hub || !hub.connected) {
    return;
  }

  const rgbLight = hub.rgbLight.device;

  if (!RGBLight.is(rgbLight)) {
    return;
  }

  rgbLight.setColor({red: 0, green: 255, blue: 0});
});
