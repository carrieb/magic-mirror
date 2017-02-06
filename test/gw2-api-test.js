const GuildWars2Api = require('../src/api/gw2-api.js')

// GuildWars2Api.fetchCurrency(
//   1,
//   (currency) => console.log('currency', currency),
//   (err) => console.log('error', err)
// );
//
// GuildWars2Api.fetchWallet(
//   (wallet) => console.log('wallet', wallet),
//   (err) => console.log('error', err)
// );

// GuildWars2Api.fetchWalletWithMetadata(
//   (walletWithMeta) => console.log('walletWithMeta', walletWithMeta),
//   (err) => console.log('error', err)
// );

// GuildWars2Api.fetchDailyAchievementsWithMetadata(
//   (achievements) => console.log('achievements', achievements),
//   (err) => console.log('error', err)
// );

GuildWars2Api.fetchCombined(
  (res) => console.log('combined res', res),
  (err) => console.log('error', err)
);
