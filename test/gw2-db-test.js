const GuildWars2DB = require('../src/gw2-db')

GuildWars2DB.getLast7DaysOfWallet((wallets) => wallets.forEach((el) => console.log(el._id, el.wallet)));
