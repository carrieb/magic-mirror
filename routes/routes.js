const express = require('express')
const router = express.Router()
const path = require('path')

const dir = path.dirname(require.main.filename);

router.get('/upload-receipt', (req, res) => {
  // TODO: this won't work, update __dirname
  res.sendFile(dir + '/views/upload-receipt.html')
});

router.get('/', (req, res) => {
  res.sendFile(dir + '/views/index.html');
});

module.exports = router
