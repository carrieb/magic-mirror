import React from 'react';
import nlp from 'compromise';

import { ALL_TOOLS } from 'util/tool-util';

import { tr } from 'util/translation-util';

import _uniqueId from 'lodash/uniqueId';
import _flatten from 'lodash/flatten';
import _sortBy from 'lodash/sortBy';
import _uniq from 'lodash/uniq';

class SmartStep extends React.Component {
  highlightKeywords(text) {
    //console.log(text, this.state.keywords);
    // if (text && text.length > 0) {
    //   return text;
    // }

    let result = [];
    let matched = [];

    const sections = this.props.ingredients || [];
    const sectionNames = sections.map(section => section.name ? section.name.toLowerCase() : null);
    const sectionedIngredients = sections.map(section => section.items);

    const allIngredients = _flatten(sectionedIngredients);
    let allIngredientNames = allIngredients.map(item => {
        //return item.name;
        if (!item) return null;
        return item.name || item.description;
        // line below only works for 'en'
        //return nlp(item.name || item.description).nouns().toSingular().out('text').trim()
      });

    const sortedNames = _sortBy(_uniq(allIngredientNames), keyword => keyword ? -keyword.length : 0);
    const sortedSections = _sortBy(_uniq(sectionNames), keyword => keyword ? -keyword.length : 0);

    // console.log(allIngredients);
    const allIngredientsByName = {};
    allIngredients.forEach((ingr) => { allIngredientsByName[ingr.name || ingr.description] = ingr });


    sortedNames.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}`, 'i');
      const match = text.match(regex);
      if (match) {
        //console.log(text, keyword);
        matched.push({
          keyword,
          type: 'ingredient'
        });
      }
    });

    sortedSections.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}`, 'i');
      const match = text.match(regex);
      if (match) {
        //console.log(text, keyword);
        matched.push({
          keyword,
          type: 'ingredient'
        });
      }
    });

    const tools = ALL_TOOLS.map((str) => tr(`recipes.tools.${str}`));
    const sortedTools = _sortBy(_uniq(tools),  keyword => keyword ? -keyword.length : 0);


    // TODO (MAJOR): move the 'finding' of keywords to the recipe editing process
    // when saving recipe, it will compute new tags, suggest to user
    // user can save them, then this SmartStep just renders special tags
    // e.g. @tool(...) @ingredient(...) @component(...)

    sortedTools.forEach((toolKeyword) => {
      const regex = new RegExp(toolKeyword, 'i');
      const match = text.match(regex);
      if (match) {
        matched.push({
          keyword: toolKeyword,
          type: 'tool'
        });

        // TODO: collect all matching tools to a section at the bottom?
      }
    });

    // TODO: add temperature / time regex ? use that to prefill structured data ?

    //console.log(matched);

    if (matched.length > 0) {
      const allFoundKeywords = matched.map(m => m.keyword);
      const splitRegex = new RegExp(`(${allFoundKeywords.join('|')})`, 'i');
      const split = text.split(splitRegex);
      //console.log(split);
      split.forEach((words) => {
        const idx = allFoundKeywords.indexOf(words.toLowerCase());
        //console.log(words, idx);
        if (idx > -1) {
          // TODO: somehow link it with the correct amount from
          // ingredients.
          // using the section name?
          // TODO: make the url use lower cased snake-case for name
          const match = matched[idx];
          //console.log(idx, matched);
          if (match.type === 'ingredient') {
            // TODO: add smart label showing amount needed
            // need to lookup in the ingredients for this recipe
            const ingr = this.props.ingredientsByName[words];
            if (ingr) {
              //console.log('smart step ingr', ingr);
              result.push(<a href={`/kitchen/${words.toLowerCase()}`} key={_uniqueId()} data-tooltip={`${ingr.quantity.amount} ${ingr.quantity.unit}`}>{words}</a>);
            } else {
              result.push(<a href={`/kitchen/${words.toLowerCase()}`} key={_uniqueId()}>{words}</a>);
            }
          } else if (match.type === 'tool') {
            result.push(<span style={{ paddingBottom: '1px', borderBottom: 'solid 1px #000'}} key={_uniqueId()}>{words}</span>);
          } else if (match.type === 'section') {
            // TODO: add more complicated tool tip listing all those pieces
            result.push(<a href={`/kitchen/${words.toLowerCase()}`} key={_uniqueId()}>{words}</a>);
          }
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
