import {HubManager, SmartMoveHub} from '@powered-up/api';
import {autorun} from 'mobx';

const hubManager = new HubManager();

autorun(() => {
  const hub = hubManager.hubs.find(SmartMoveHub.is);

  if (!hub) {
    return;
  }

  console.log('Hub found!');
});
