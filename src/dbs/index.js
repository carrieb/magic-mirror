const MongoClient = require('mongodb').MongoClient

const BASE_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbs = ['food', 'gw2', 'recipes', 'meals']; // INDEX MATTERS!
const uris = dbs.map((name) => `${BASE_URI}/${name}`);

const connect = function(url) {
  return MongoClient.connect(url, { useNewUrlParser: true })
    .then(client => client.db());
}

module.exports = async function() {
  let databases = await Promise.all(uris.map(connect))

  return {
    food: databases[0],
    gw2: databases[1],
    recipes: databases[2],
    meals: databases[3]
  }
}
