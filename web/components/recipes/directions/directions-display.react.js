import React from 'react';
import PropTypes from 'prop-types';

import _sortBy from 'lodash/sortBy';
import _uniq from 'lodash/uniq';
import _flatten from 'lodash/flatten';
import _uniqueId from 'lodash/uniqueId'

const MAX_ITEMS = 2;

class Directions extends React.Component {
  constructor(props) {
    super(props);
    this.toggleCollapse = this.toggleCollapse.bind(this);

    const ingredients = this.props.ingredients || [];

    const keywords = _sortBy(_uniq(_flatten(ingredients.map((section) => section.items))
      .map((item) => item.name)), (keyword) => keyword ? -keyword.length : 0);

    this.state = { collapsed: true, keywords };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.ingredients) {
      const keywords = _sortBy(_uniq(_flatten(nextProps.ingredients.map((section) => section.items))
        .map((item) => item.name)), (keyword) => keyword ? -keyword.length : 0);
      this.setState({ keywords });
    }
  }

  toggleCollapse() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  highlightKeywords(text) {
    //console.log(text, this.state.keywords);
    if (text && text.length > 0) {
      return text;
    }

    const keywords = this.state.keywords || [];
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
    const directions = this.props.directions || [];

    const directionEls = directions.map((directionsList, i) => {
      const title = <div className="ui sub header">{ directionsList.name || 'directions' }</div>;
      const steps = directionsList.steps || [];

      const stepEls = steps.map((step, idx) => {
        if ((this.props.enableCollapse) && (this.state.collapsed && idx >= MAX_ITEMS)) { return null };
        return <div className="item" key={idx}>{this.highlightKeywords(step.content)}</div>
      });

      return (
        <div className="content" key={i}>
          { title }
          <div className="ui ordered list">
            { stepEls }
          </div>
          { (this.props.enableCollapse && steps.length > MAX_ITEMS) &&
            <div className="collapse-toggle" onClick={this.toggleCollapse}>
              <i className={`ui grey icon ${this.state.collapsed ? 'ellipsis horizontal' : 'minus' }`}/>
            </div>
          }
        </div>
      );
    });

    return <div className="directions-wrapper">{ directionEls }</div>;
  }
}

Directions.propTypes = {
  enableCollapse: PropTypes.bool
}

Directions.defaultProps = {
  enableCollapse: false
}

export default Directions;
