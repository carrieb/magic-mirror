const express = require('express');
const app = express();
const path = require('path');

const api = require('./routes/api');
const routes = require('./routes/routes');
const kitchen = require('./routes/kitchen');
const recipes = require('./routes/recipes');
const meals = require('./routes/meals');

const Config = require('./src/config.js');
const initDbs = require('./src/dbs');

app.use('/api/meals', meals);
app.use('/api/kitchen', kitchen);
app.use('/api/recipes', recipes);
app.use('/api', api);
app.use('/', routes);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/food-images', express.static(path.join(__dirname, 'tmp', 'food-images')));
app.use('/images', express.static(path.join(__dirname, 'tmp', 'images')));
app.use('/processed-images', express.static(path.join(__dirname, 'tmp', 'processed-images')));
app.use('/dist', express.static(path.join(__dirname, 'semantic', 'dist')));
app.use('/dist', express.static(path.join(__dirname, 'node_modules', 'cropperjs', 'dist')));

initDbs().then(dbs => {
  app.locals.dbs = dbs;
  console.log('env:', app.get('env'));

  app.listen(3000, () => {
    console.log(`Node.js app magic-mirror is listening at http://localhost:${3000}`);
  });
}).catch(err => {
  console.error(err);
});
