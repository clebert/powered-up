import noble from 'noble';

noble.on('discover', peripheral => {
  console.log('discover', peripheral);
});
