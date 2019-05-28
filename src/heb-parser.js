const util = require('util');

const parseItem = (idx, line) => {
    const itemRegex = `^(${idx}|\\d) (.*) (\\d{0,2}?\\.\\d{2})$`;
    const regex = new RegExp(itemRegex);
    const match = line.match(regex);
    console.log(regex);
    if (match) {
      const description = match[2];
      const price = match[3];
      return { description, price, line }
    } else {
      // handle error?
      return { description: line.replace(`${idx} `, ''), line }
    }
}

const processLines = (lines) => {
  const items = [];
  let nextItemIdx = 1;
  let foundStart = false;
  for (idx in lines) {
    const line = lines[idx];
    const lineText = line.text.trim();
    console.log(lineText);
    // const firstChar = line.words[0].symbols[0];
    // console.log(firstChar.text);
    // console.log(util.inspect(firstChar.choices, false, 1));
    const nextLineRegexStr = `^(${nextItemIdx}|\\d) (.*)$`; // added some wiggle room in case # is parsed wrong
    const regex = new RegExp(nextLineRegexStr);
    const matches = lineText.match(regex);
    //console.log(nextLineRegexStr);
    //console.log(matches);
    if (matches) {
      // found next line
      const item = parseItem(nextItemIdx, lineText);
      console.log(item);
      items.push(item);
      nextItemIdx++;
    } else {
      // for now, don't care
      if (foundStart) {
        // second line .. or we're done?
      } else {
        // don't care
      }
    }
  }
  console.log(items);
  return items;
}

const HebParser = {
  parseTessaract(tesseractResult) {
    return processLines(tesseractResult.lines);
  },

  parseTextObj(linesObj) {
    return processLines(linesObj);
  }
}

module.exports = HebParser;
