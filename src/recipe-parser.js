import _isEmpty from 'lodash/isEmpty';
import _startsWith from 'lodash/startsWith';

import { parseQuantity } from 'src/common/quantities';

import { getLocale } from 'util/translation-util';

const extraWords = ['of'];

function parseIngredientDetails(str) {
  // console.log('parsing ingredients from:', str);
  // console.log(str, str.indexOf('(') );
  if (str.indexOf('(') > -1 || str.indexOf('（') > -1) {
    // console.log('paren in ingr');
    const split = str.split(/\(|（/);
    // console.log(split);
    const name = split[0].trim();
    const rest = split[1].trim();
    const modifier = rest.substring(0, rest.length - 1);
    return { name, modifier };
  } else {
    return { name: str, modifier: null };
  }
}

function ingredientsToText(ingredients) {
  let text = '';
  const sections = ingredients;
  sections.forEach((section) => {
    if (sections.length > 1) {
      text += `${section.name}\n`;
    }

    if (section.items) {
      section.items.forEach((item) => {
        const quantity = item.quantity.unit ? `${item.quantity.amount} ${item.quantity.unit}` : `${item.quantity.amount}`;
        text += `${quantity} ${item.description || item.name}`;
        if (item.modifier) {
          text += ` (${item.modifier})`;
        }
        text += '\n';
      });
    }

    text += '\n';
  });

  // console.log('ingredients to text result:', text);
  return text;
}

function directionsToText(directions) {
  let text = "";
  const sections = directions;
  sections.forEach((section) => {
    if (sections.length > 1) {
      text += `${section.name}\n`;
    }

    if (section.steps) {
      section.steps.forEach((step, i) => {
        text += `${i+1}. ${step.content}\n`;
      });
    }

    text += '\n';
  });

  // console.log('directions to text result:', text);
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

  parseIngredientLines(lines, lang, splitOverCommas=false) {
    const result = [];

    if (lines) {
      lines.forEach((line) => {
        // TODO: handle splitting over commas
        const quantity = parseQuantity(line, lang);
        console.log(quantity);
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
        result.push(item);
      });
    }

    return result;
  },

  parseIngredients(text, splitOverCommas=false) {
    const lang = getLocale() || 'en';
    const result = [ ];
    const textSections = text ? text.trim().split('\n\n') : [];

    if (textSections.length > 0) {
      textSections.forEach((section) => {
        const lines = section ? section.split('\n') : [];
        const header = lines[0].trim();
        // parse rest as ingredient lines
        const items = this.parseIngredientLines(lines.slice(1), lang, splitOverCommas);
        result.push({ name: header, items });
      });
    } else {
      const lines = text ? text.trim().split('\n') : [];
      // parse as ingredient lines
      const items = this.parseIngredientLines(lines, lang, splitOverCommas);
      result.push({ name: 'default', items });
    }


    console.log('parsed ingredients:', result);

    return result;
  },

  ingredientsToText,

  directionsToText
}

export default RecipeParser;
