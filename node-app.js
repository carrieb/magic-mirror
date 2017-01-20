const express = require('express');
const app = express();
const path = require('path');

const api = require('./routes/api');
const routes = require('./routes/routes');

app.use('/api', api);
app.use('/', routes);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
