import React from 'react';
import PropTypes from 'prop-types';

import _minBy from 'lodash/minBy';

class Timeline extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const title = <div className="ui grey sub header">{ 'timeline' }</div>;
    const directions = this.props.directions;
    console.log(directions);
    // this won't work as simply if I'm doing intelligent section dependencies
    const minDuration = _minBy(directions[0].steps, (step) => step.duration).duration;
    const minHeight = 25;
    let y = 0;

    const rectangles = directions[0].steps.map((step, i) => {
      const heightPerc = step.duration / minDuration;
      const height = heightPerc * minHeight;
      console.log(step.duration, minDuration, heightPerc, height);
      const el = <div key={i} style={{ height: `${height}px`, border: 'solid 1px black'}}>
        <p style={{ textAlign: 'center' }}>{ step. content }</p>
      </div>;
      y+=height;
      return el;
    });


    return (
      <div className="timeline-wrapper">
        { title }
        <div>
          { rectangles }
        </div>
      </div>
    );
  }
}

Timeline.propTypes = {
  directions: PropTypes.array
}

Timeline.defaultProps = {
  directions: []
}

export default Timeline;
