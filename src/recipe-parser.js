import _isEmpty from 'lodash/isEmpty';
import _startsWith from 'lodash/startsWith';

import { parseQuantity } from 'src/common/quantities';

import { getLocale } from 'util/translation-util';

const extraWords = ['of'];

function parseIngredientDetails(str) {
  //console.log('parsing ingredients from:', str);
  console.log(str, str.indexOf('(') );
  if (str.indexOf('(') > -1 || str.indexOf('（') > -1) {
    console.log('paren in ingr');
    const split = str.split(/\(|（/);
    console.log(split);
    const name = split[0].trim();
    const rest = split[1].trim();
    const modifier = rest.substring(0, rest.length - 1);
    return { name, modifier };
  } else {
    return { name: str, modifier: null };
  }
}

function ingredientsToText(ingredients) {
  let text = "";
  const sections = ingredients;
  sections.forEach((section) => {
    if (sections.length > 1) {
      text += `${section.name}\n`;
    }

    section.items.forEach((item) => {
      const quantity = item.quantity.unit ? `${item.quantity.amount} ${item.quantity.unit}` : `${item.quantity.amount}`;
      text += `${quantity} ${item.description || item.name}`;
      if (item.modifier) {
        text += ` (${item.modifier})`;
      }
      text += '\n';
    });

    text += '\n';
  });

  console.log(text);
  return text;
}

function directionsToText(directions) {
  let text = "";
  const sections = directions;
  sections.forEach((section) => {
    if (sections.length > 1) {
      text += `${section.name}\n`;
    }

    section.steps.forEach((step, i) => {
      text += `${i+1}. ${step.content}\n`;
    });

    text += '\n';
  });

  console.log(text);
  return text;
}

const RecipeParser = {
  parseDirections(text, multisection=false) {
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

  parseIngredients(text, multisection=false, splitOverCommas=false) {
    const result = [ { items: [] } ];
    const lines = text ? text.trim().split('\n') : [];
    const lang = getLocale() || 'en';

    //console.log(lines);
    console.log('parsing ingredients:', multisection, lang);

    let section = 0;
    let itemIndex = 0;
    let expectingHeader = multisection;

    for (let i = 0; i< lines.length; i++) {
      const line = lines[i];
      //console.log(line, line.trim() === '');

      if (line.trim() === '' && multisection) {
        // progress to next section
        result.push( { items: [] } );
        section++;
        expectingHeader = true;
        itemIndex = 0;
        continue;
      }


      // splitting by commans: by default doesn't happen
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
            itemIndex++;
          });
      } else {
        const quantity = parseQuantity(line, lang);
        // TODO: handle new lines for sections
        console.log(quantity);

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

          console.log(item);
          result[section].items.push(item);

          expectingHeader = false;
          itemIndex++;
          //console.log(result);
        } else {
          // TODO: check if sections is working right
          if (expectingHeader && itemIndex === 0) {
            result[section].name = line;
            expectingHeader = false;
          }
        }
      }
    }

    //console.log('parsed ingredients', result);

    return result;
  },

  ingredientsToText,

  directionsToText
}

export default RecipeParser;
