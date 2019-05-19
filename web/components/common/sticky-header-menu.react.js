import React from 'react';

class StickyHeaderMenu extends React.Component {
  componentDidMount() {
    $('.ui.sticky').sticky();
  }

  componentDidUpdate() {
    $('.ui.sticky').sticky('refresh');
  }

  render() {
    return (
      <div className="ui sticky sticky-header-menu">
        <div className="inner">
          { this.props.children }
        </div>
      </div>
    );
  }
}

export default StickyHeaderMenu;
