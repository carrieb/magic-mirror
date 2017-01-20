const express = require('express')
const router = express.Router()

const path = require('path')
const dir = path.dirname(require.main.filename);

const multer  = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir + '/tmp/images')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});
var upload = multer({ storage });

const ReceiptProcessor = require('../src/receipt-processor');


router.get('/upload-receipt', (req, res) => {
  // TODO: this won't work, update __dirname
  res.sendFile(dir + '/views/upload-receipt.html')
});

router.post('/receipt', upload.single('receipt'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.file);
  const items = ReceiptProcessor.extractItems(req.file);
  res.redirect('/upload-receipt');
})

router.get('/', (req, res) => {
  res.sendFile(dir + '/views/index.html');
});

module.exports = router
