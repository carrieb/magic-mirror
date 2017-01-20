const parseItem = (idx, line) => {
    const itemRegex = `^(${idx}) (.*) (\\d{1,2}\\.\\d{2})$`;
    const regex = new RegExp(itemRegex);
    const match = line.match(regex);
    if (match) {
      const description = match[2];
      const price = match[3];
      return { description, price }
    } else {
      // handle error?
      return { description: line.replace(`${idx} `, ''), price: "???" }
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
    const nextLineRegexStr = `^(${nextItemIdx}) (.*)$`;
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
}

const HebParser = {
  parseTessaract(tesseractResult) {
    processLines(tesseractResult.lines);
  },

  parseTextObj(linesObj) {
    processLines(linesObj);
  }
}

module.exports = HebParser;
