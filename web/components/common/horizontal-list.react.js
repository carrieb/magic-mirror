import React from 'react';
import PropTypes from 'prop-types';

// uses bootstrap's horizontal list
// http://getbootstrap.com/css/#horizontal-description
class HorizontalList extends React.Component {
  render() {
    const listEls = this.props.items.map((item) => {
      // TODO: pass in items instead of content
      return [
        <dt>{ item.title }</dt>,
        <dd>{ item.content }</dd>
      ]
    })
    return (
      <dl className="dl-horizontal">
        { listEls }
      </dl>
    )
  }
}

HorizontalList.propTypes = {
  items: PropTypes.array.isRequired
}

export default HorizontalList;
