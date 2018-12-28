import React from 'react';

import 'sass/common/fixed-footer.scss';

class FixedFooter extends React.Component {
  render() {
    return (
      <div className="fixed-footer">
        { this.props.children }
      </div>
    );
  }
}

export default FixedFooter;
