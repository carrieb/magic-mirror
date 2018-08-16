const MongoClient = require('mongodb').MongoClient

// Note: A production application should not expose database credentials in plain text.
// For strategies on handling credentials, visit 12factor: https://12factor.net/config.
const FOOD_URI = 'mongodb://localhost:27017/food';
const GW2_URI = 'mongodb://localhost:27017/gw2';
const RECIPES_URI = 'mongodb://localhost:27017/recipes';

const connect = function(url) {
  return MongoClient.connect(url, { useNewUrlParser: true }).then(client => client.db());
}

module.exports = async function() {
  let databases = await Promise.all([connect(FOOD_URI), connect(GW2_URI), connect(RECIPES_URI)])

  return {
    food: databases[0],
    gw2: databases[1],
    recipes: databases[2]
  }
}
