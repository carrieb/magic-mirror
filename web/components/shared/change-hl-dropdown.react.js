import React from 'react';

import { withRouter } from 'react-router';

import { setLocale, getLocale } from 'util/translation-util';

const localeText = {
  en: 'English',
  jp: '日本語'
};

const flag = {
  en: 'us',
  jp: 'jp'
}

class ChangeHlDropdown extends React.Component {
  handleDropdownRef = (ref) => {
    $(ref).dropdown({
      onChange: (value, text, choice) => {
        setLocale(value);
      }
    });
  }

  render() {
    const hl = getLocale();

    return (
      <div style={{ width: '125px' }}>
        <div className="ui fluid selection dropdown" ref={this.handleDropdownRef}>
          <i className="dropdown icon"/>
          <div className="item" data-value={hl}><i className={`${flag[hl]} flag`}/>{ localeText[hl] }</div>
          <div className="menu">
            <div className="item" data-value="en"><i className="us flag"/>English</div>
            <div className="item" data-value="jp"><i className="jp flag"/>日本語</div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(ChangeHlDropdown);
