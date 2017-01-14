const express = require('express');
const app = express();
const path = require('path');

const api = require('./routes/api');

app.use('/api', api);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
