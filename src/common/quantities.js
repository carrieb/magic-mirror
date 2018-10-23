const quantityUnits = {
  en: ['tsp', 'teaspoon', 'tbsp', 'tablespoon',
       'hunk', 'clove', 'cup', 'gram', 'ounce',
       'oz', 'lb', 'pound', 'kg', 'kilogram',
       'ml', 'milliliter'],
  jp: ['小さじ', '大さじ', '片分', '少々']
}

const fractions = [
  { character: '½', value: 0.5 },
  { character: '⅓', value: 1.0/3.0 },
  { character: '¼', value: 0.25 }
];

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

module.exports = { parseQuantity, parseAmount };
