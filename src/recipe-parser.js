import _isEmpty from 'lodash/isEmpty';
import _startsWith from 'lodash/startsWith';

function parseIngredient(text) {
  const idx = text.indexOf(' ');
  const quantity = text.substring(0, idx).trim();
  const rest = text.substring(idx).trim();
  let amt = '';
  let unit = '';
  for (var i = 0; i < quantity.length; i++) {
    const c = quantity.charAt(i);
    if (!isNaN(c) || c === '/' || c === '~') {
      amt += c;
    } else {
      unit += c;
    }
  }
  if (amt.indexOf('/') > -1) {
    if (amt === '1/2') amt = 0.5;
    if (amt === '1/3') amt = 0.33;
    if (amt === '1/4') amt = 0.25;
  } else if (amt.indexOf('~') > -1) {
    const split = amt.split('~');
    const bottom = parseInt(split[0]);
    const top = parseInt(split[1]);
    amt = (bottom + top * 1.0) / 2;
  } else {
    amt = parseInt(amt);
  }
  console.log(quantity, rest, amt, unit);
  const result = { name: rest.toLowerCase(), quantity: { amount: amt }};
  if (!_isEmpty(unit)) {
    result.quantity.unit = unit;
  }
  return result;
}

const RecipeParser = {
  parseDirections(text) {
    const split = text ? text.split('\n') : [];
    console.log(split);
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

  parseIngredients(text) {
    const lines = text ? text.split('\n') : [];
    console.log(lines);
    const result = [ { items: [] } ];
    let section = 0;
    let counter = 0;
    lines.forEach((line) => {
      if (line.indexOf(',') > -1) {
          const split = line.split(',');
          console.log(split);
          split.forEach((ingr) => {
            const ingredient = parseIngredient(ingr.trim());
            result[section].items.push(ingredient);
            counter++;
          });
      } else {
        if (isNan(line[0])) {
          const ingredient = parseIngredient(line.trim());
          result[section].items.push(ingredient);
          counter++;
        } else {
          if (counter === 0) {
            result[section].name = line;
          }

          else {
            counter = 0;
            section++;
            result[section].name = line;
            result.push({ items: [] });
          }
        }
      }
    });

    return result;
  }
}

export default RecipeParser;
