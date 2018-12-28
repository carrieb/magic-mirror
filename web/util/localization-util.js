import { getLocale } from 'util/translation-util';

import _get from 'lodash/get';

const imgLocalizations = {
  en: {
    meals: {
      breakfast: 'egg-and-bacon.png',
      lunch: 'sandwich.png',
      dinner: 'chicken.png'

    }
  },

  jp: {
    meals: {
      breakfast: 'onigiri.png',
      lunch: 'bento.png',
      dinner: 'curry.png'
    }
  }
}

const LocalizationUtil = {
  img(str, data) {
    const hl = getLocale();
    return _get(imgLocalizations[hl], str, str);
  }
};

module.exports = LocalizationUtil;
