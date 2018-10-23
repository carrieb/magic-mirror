import _isEmpty from 'lodash/isEmpty';
import _startsWith from 'lodash/startsWith';

import { parseQuantity } from 'src/common/quantities';

const extraWords = ['of'];

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
        const quantity = parseQuantity(line);
        // TODO: handle new lines for sections
        //console.log(quantity);

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
