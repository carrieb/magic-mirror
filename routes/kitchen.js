const express = require('express')
const router = express.Router();

const Config = require('../src/config.js');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const FoodDAO = require('../src/dbs/food-db');

const multer  = require('multer');
const path = require('path');
const foodImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, Config.getBaseDir() + '/tmp/food-images')
  },
  filename: (req, file, cb) => {
    cb(null, req.body.filename + path.extname(file.originalname));
  }
});
const foodImageUpload = multer({ storage: foodImageStorage })

router.get('/', (req, res) => {
  FoodDAO.getKitchen(
    res.app.locals.dbs,
    (result) => res.json(result),
    (err) => res.status(500).send('Failed to get kitchen.')
  );
});

// update
router.put('/food', jsonParser, (req, res) => {
  console.log(req.body.item);
  // TODO: is id actually being passed back to response?
  FoodDAO.updateItem(res.app.locals.dbs, req.body.item, (id) => res.send(id));
});

// star
router.get('/star/:id', (req, res) => {
  const id = req.params.id;
  const starred = req.query.s === "1" ? true : false;
  console.log(req.query.s);
  FoodDAO.star(res.app.locals.dbs, id, starred, () => {
    res.json('OK');
  });
});

// TODO: remove?, not used currently. could add to admin bar
// delete
router.delete('/trash', jsonParser, (req, res) => {
  console.log(req.query);
  console.log(req.body);
  FoodDAO.removeItem(res.app.locals.dbs, req.body.id, () => res.send('OK'));
});

// post an image
router.post('/image', foodImageUpload.single('image'), function (req, res, next) {
  //console.log(req.file);
  console.log(req.body.filename);
  console.log(req.file.filename);
  FoodDAO.updateImage(res.app.locals.dbs, req.body.filename, req.file.filename, () => {
    res.send(req.file.filename);
  });
  // TODO: save name into db lookup using req.body.filename and set to req.file.filename
});

// add multiple items
router.post('/bulk', jsonParser, (req, res) => {
  FoodDAO.storeNewItems(res.app.locals.dbs, req.body.items, () => {
    res.send('OK');
  });
});


module.exports = router;
