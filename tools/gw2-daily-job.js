const GuildWars2Api = require('../src/api/gw2-api');

const initDbs = require('./src/dbs');

initDbs().then(dbs => {
  GuildWars2Api.fetchWallet(
    (wallet) => { GuildWars2Api.saveWalletRecord(dbs, wallet) },
    (err) => {}
  );
}).catch(err => {
  console.error(err);
});
