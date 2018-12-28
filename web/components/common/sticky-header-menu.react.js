import React from 'react';

class StickyHeaderMenu extends React.Component {
  componentDidMount() {
    console.log('wut');
    $('.ui.sticky').sticky();
  }

  componentDidUpdate() {
    console.log('sticky header update');
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
