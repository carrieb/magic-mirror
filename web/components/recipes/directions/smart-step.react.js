import React from 'react';
import nlp from 'compromise';

import _uniqueId from 'lodash/uniqueId';

class SmartStep extends React.Component {
  highlightKeywords(text) {
    //console.log(text, this.state.keywords);
    // if (text && text.length > 0) {
    //   return text;
    // }

    const keywords = this.props.keywords || [];
    let result = [];
    let matched = [];
    keywords.forEach((keyword) => {
      const regex = new RegExp(keyword, 'i');
      const match = text.match(regex);
      if (match) {
        //console.log(text, keyword);
        matched.push(keyword);
      }
    });

    if (matched.length > 0) {
      const splitRegex = new RegExp(`(${matched.join('|')})`, 'i');
      const split = text.split(splitRegex);
      split.forEach((words) => {
        if (matched.indexOf(words.toLowerCase()) > -1) {
          // TODO: somehow link it with the correct amount from
          // ingredients.
          // using the section name?
          // TODO: make the url use lower cased snake-case for name
          result.push(<a href={`/kitchen/${words.toLowerCase()}`} key={_uniqueId()}>{words}</a>);
        } else {
          result.push(words);
        }
      });
    } else {
      return text;
    }

    return result;
  }

  render() {
    const step = this.props.step;
    if (!step) {
      return null;
    }

    const sentences = step.split('. ');

    // sentences.forEach((sentence, i) => {
    //   if (sentence.trim().length === 0) return;
    //   const doc = nlp(sentence);
    //   console.log(i, sentence, doc.terms().out('array'));
    //   this.props.keywords.forEach((keyword) => {
    //     console.log(keyword, doc.has(keyword));
    //   })
    // });

    return (
      <div className="smart-step">
        { this.highlightKeywords(step) }
      </div>
    );
  }
}

export default SmartStep;
