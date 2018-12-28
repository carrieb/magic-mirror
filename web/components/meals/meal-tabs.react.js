import React from 'react';
import { withRouter } from 'react-router';

import { tr } from 'util/translation-util';

const tabNames = ['recipes', 'schedule', 'shopping']

class MealTabs extends React.Component {
  onTabClick = (tagName) => {
    return (ev) => {
      this.props.history.push(`/meal/${this.props.match.params.id}/${tagName}`)
    }
  }

  render() {
    const tabs = tabNames.map(tab =>
      <a key={tab}
         style={{ textTransform: 'capitalize' }}
         className={`item ${this.props.location.pathname.indexOf(tab) > -1 ? 'orange active' : ''}`}
         onClick={this.onTabClick(tab)}>
         { tr(`tabs.meal.${tab}`) }
       </a>
    );

    return (
      <div className="ui secondary pointing menu">
        { tabs }
      </div>
    );
  }
}

export default withRouter(MealTabs);
