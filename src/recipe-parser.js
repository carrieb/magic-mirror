import _isEmpty from 'lodash/isEmpty';
import _startsWith from 'lodash/startsWith';

const quantityUnits = ['小さじ', 'tsp', 'teaspoon', 'tsps', 'teaspoons',
  '大さじ', 'tbsp', 'tablespoon', 'tbsps', 'tablespoons',
  'hunk', 'hunks', 'clove', 'cloves',
  'cup', 'gram', 'cups', 'grams', '片分', '少々',
  'oz', 'ounces', 'lb', 'lbs'];

const extraWords = ['of'];

function parseNumber(str) {
  if (str.indexOf('/') > -1) {
    const parts = str.trim().split('/');
    return parseFloat(parts[0]) / parseFloat(parts[1]);
  } else {
    switch (str) {
      case '½':
        return 0.5;
      case '⅓':
        return 1.0 / 3.0;
      case '¼':
        return 0.25;
      default:
        return parseFloat(str);
    }
  }
}

function parseAmount(str) {
  const pieces = str.split(' ');
  let total = 0.0;

  pieces.forEach((amtStr) => {
    const amt = parseNumber(amtStr);
    total += amt;
  });

  return total;
}

function parseIngredientDetails(str) {
  //console.log('parsing ingredients from:', str);
  if (str.indexOf('(') > -1) {
    const split = str.split('(');
    const name = split[0].trim();
    const rest = split[1].trim();
    const modifier = rest.substring(0, rest.length - 1);
    return { name, modifier };
  } else {
    return { name: str, modifier: null };
  }
}

function parseQuantity(text) {
  const amountRegex = new RegExp('([1-9,½,¼,⅓,\/, ]+)');
  const match = text.match(amountRegex);
  if (match) {
    const amtStr = match[0].trim();
    const other = text.substring(amtStr.length).trim();
    const amount = parseAmount(amtStr);
    const split = other.split(' ', 1);
    const unitStr = split[0].trim();
    const unit = parseUnit(unitStr);
    const rest = other.substring(unitStr.length).trim();
    return { amount, unit, rest }
  } else {
    return { amount: 0, unit: 'gram' };
  }
}

function parseIngredient(text) {
  const parsedQ = parseQuantity(text);
  const details = parseIngredientDetails(parsedQ.rest);
  //console.log(details);

  const result = {
    name: details.name,
    modifier: details.modifier,
    quantity: {
      amount: parsedQ.amount,
      unit: parsedQ.unit
    }
  };
  return result;
}

const RecipeParser = {
  parseDirections(text) {
    const split = text ? text.split('\n') : [];
    //console.log(split);
    const result = [ { steps: [] } ];
    let section = 0;
    let counter = 0;

    split.forEach((line, idx) => {
      const cleaned = line.trim();
      if (_isEmpty(line)) return;

      else {
        const prefix = `${counter+1}.`;

        if (_startsWith(line, prefix)) {
          if (section < 0) section = 0;
          const stepOnly = line.replace(prefix, '').trim();
          result[section].steps.push({ content: stepOnly });
          counter++;
        } else {
          if (counter === 0) {
            result[section].name = line;
          } else {
            // if we're not at the beginning
            // and we have more to go
            // add a new section
            if (split.length > idx + 1) {
              counter = 0;
              section++;
              result.push({ steps: [], name: line });
            }
          }
        }
      }
    });

    return result;
  },

  tryAndParseQuantity(line) {
    let quantityRegex = '^([\\d+|½|¼|⅓|\\d+\\/\\d+|\\s]+)';
    quantityRegex += `(${quantityUnits.join('|')})?(.*)`;
    quantityRegex = new RegExp(quantityRegex);
    const match = quantityRegex.exec(line);
    const firstChar = line[0];
    if (match) {
      const amount = match[1] ? match[1].trim() : 0;
      // TODO: parse the amount
      const unit = match[2] ? match[2].trim() : null;
      const rest = match[3].trim();

      return { amount, unit, rest };
    } else {
      return null;
    }
  },

  parseIngredients(text, splitOverCommas=false) {
    const result = [ { items: [] } ];
    const lines = text ? text.split('\n') : [];

    //console.log(lines);

    let section = 0;
    let index = 0;
    let expectingHeader = true;

    lines.forEach((line) => {
      //console.log(line);

      if (line.indexOf(',') > -1 && splitOverCommas) {
          //console.log('splitting over commas');
          const split = line.split(',');
          //console.log(split);
          split.forEach((ingr) => {
            const ingredient = parseIngredientDetails(ingr.trim());
            result[section].items.push({
              quantity: {
                amount: quantity.amount,
                unit: quantity.unit
              },
              description: ingredient.name,
              modifier: ingredient.modifier
            });
            index++;
          });
      } else {
        const quantity = this.tryAndParseQuantity(line);
        // TODO: handle new lines for sections

        if (quantity) {
          const ingredient = parseIngredientDetails(quantity.rest);
          const item = {
            quantity: {
              amount: quantity.amount,
              unit: quantity.unit
            },
            description: ingredient.name,
            modifier: ingredient.modifier
          };
          //console.log(item);
          result[section].items.push(item);

          expectingHeader = false;
          index++;
          //console.log(result);
        } else {
          // TODO: check if sections is working right
          if (expectingHeader && index === 0) {
            result[section].name = line;
            expectingHeader = false;
          }
        }
      }
    });

    //console.log('parsed ingredients', result);

    return result;
  }
}

export default RecipeParser;
