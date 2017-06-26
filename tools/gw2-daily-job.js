const GuildWars2Api = require('../src/api/gw2-api')

GuildWars2Api.fetchWallet(
  (wallet) => { GuildWars2Api.saveWalletRecord(wallet) },
  (err) => {}
);
