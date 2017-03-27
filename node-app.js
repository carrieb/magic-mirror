const express = require('express');
const app = express();
const path = require('path');

const api = require('./routes/api');
const routes = require('./routes/routes');

app.use('/api', api);
app.use('/', routes);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/food-images', express.static(path.join(__dirname, 'tmp', 'food-images')));
app.use('/images', express.static(path.join(__dirname, 'tmp', 'images')));
app.use('/processed-images', express.static(path.join(__dirname, 'tmp', 'processed-images')));
app.use('/dist', express.static(path.join(__dirname, 'semantic', 'dist')));
app.use('/dist', express.static(path.join(__dirname, 'node_modules', 'cropperjs', 'dist')));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
