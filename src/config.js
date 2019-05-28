const BASE_MIRROR_DIR = process.env.BASE_MIRROR_DIR;
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader(BASE_MIRROR_DIR + 'config/app.properties');

const RECEIPT_IMAGES_DIR = properties.get('receipt.images.dir');

const Config = {
  getBaseDir() {
    return BASE_MIRROR_DIR;
  },

  getConfigDir() {
    return BASE_MIRROR_DIR + 'config/';
  },

  RECEIPT_IMAGES_DIR
}

module.exports = Config;
