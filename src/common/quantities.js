const qty = require('js-quantities');

const quantityUnits = {
  en: ['tsp', 'teaspoon', 'tbsp', 'tablespoon',
       'hunk', 'clove', 'cup', 'gram', 'g', 'ounce',
       'oz', 'lb', 'pound', 'kg', 'kilogram',
       'ml', 'milliliter'],
  jp: ['小さじ', '大さじ', '片分', '少々', '滴', 'g', 'ml']
}

const fractions = [
  { character: '½', value: 0.5 },
  { character: '⅓', value: 1.0/3.0 },
  { character: '¼', value: 0.25 }
];

const _isNumber = require('lodash/isNumber')

function parseQuantity(string, lang='en') {
  const fractionsString = fractions.map(f => f.character).join('|');
  let quantityRegex = `^([\\d+|${fractionsString}|\\d+\\/\\d+|\\s]+)`;
  if (lang === 'en') {
    quantityRegex += `(${quantityUnits[lang].join('|')}|${quantityUnits[lang].map(q => q + 's').join('|')})?(.*)`;
  } else {
    quantityRegex += `(${quantityUnits[lang].join('|')})?(.*)`;
  }
  quantityRegex = new RegExp(quantityRegex);

  const match = quantityRegex.exec(string);
  if (match) {
    const amount = match[1] ? parseAmount(match[1].trim()) : 0;
    const unit = match[2] ? match[2].trim() : null;
    const rest = match[3].trim();

    return { amount, unit, rest };
  } else {
    return null;
  }
}

function parseAmount(string) {
  if (_isNumber(string)) {
    return string;
  }

  let amt = 0;
  const split = string.split(' ');

  split.forEach((numStr) => {
    if (numStr.indexOf('/') > -1) {
      const fraction = numStr.split('/');
      const top = fraction[0];
      const bottom = fraction[1];
      amt += top / bottom;
    } else {
      let num = parseFloat(numStr);

      if (numStr === '½') {
        num = 0.5;
      }
      if (numStr === '⅓') {
        num = 1.0/3.0;
      }
      if (numStr === '¼') {
        num = 0.25;
      }

      amt += num;
    }
  });

  return amt;
}

function combineQuantities(dest, addition) {
  // TODO: choose preferred unit? e.g. gallon vs. cup
  //console.log(dest.unit, addition.unit);
  if (dest.unit === 'pkg' || addition.unit === 'pkg') {
    console.log('dunno what to do with pkg');
    return;
  }

  if (dest.unit === 'quarter cup' || addition.unit === 'quarter cup') {
    console.log('dunno what to do with quarter cup');
    return;
  }

  // TODO: use convertToQty here
  const base = qty(parseAmount(dest.amount), dest.unit);
  const add = qty(parseAmount(addition.amount), addition.unit);
  //console.log(base, add);
  try {
    const sum = base.add(add);
    return {
      unit: dest.unit,
      amount: sum.toPrec(0.01).scalar
    }
  } catch (e) {
    //console.error(e);
  }
}

function convertToQty(quantity) {
  if (quantity.unit !== 'pkg' && quantity.unit !== 'quarter cup') {
    return qty(parseAmount(quantity.amount), quantity.unit);
  }
  return null;
}

function amountToText(amount) {
  const remainder = amount - Math.floor(amount);
  const whole = amount - remainder;

  let amt = whole === 0 ? '' : whole + ' ';
  if (remainder === .75) { amt += '¾ '; }
  if (remainder === .33) { amt += '⅓ '; }
  if (remainder === .25) { amt += '¼ '; }
  if (remainder === .5) { amt += '½ '; }

  return amt;
}

module.exports = { parseQuantity, parseAmount, combineQuantities, convertToQty, amountToText };
