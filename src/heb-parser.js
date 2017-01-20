const HebParser = {
  parse(tesseractResult) {
    const items = [];
    const nextItemIdx = 1;
    for (idx in tesseractResult.lines) {
      const line = tesseractResult.lines[idx];
      const lineText = line.text.trim();
      console.log(lineText);
      console.log(line.confidence);
      line.words.forEach((word) => {
        console.log(`${word.text} (${word.confidence})`);
      });
    }
  }
}

module.exports = HebParser;
