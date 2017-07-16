import React from 'react';

import ApiWrapper from '../util/api-wrapper';

const listOrder = ["Today", "Tonight", "Tomorrow", "Week", "Weekend"];

import HorizontalList from 'components/common/horizontal-list.react';

import sortBy from 'lodash/sortBy';

class Wunderlist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      lists: [] /* an obj { title, tasks } */
    }
  }

  componentWillMount() {
    ApiWrapper.getWunderlist((lists) => {
      const sorted = sortBy(lists, (l) => { return listOrder.indexOf(l.title); });
      this.setState({
        loaded: true,
        lists: sorted
      });
    });
  }

  render() {
    let items = [];
    if (this.state.loaded) {
      items = this.state.lists.map((list) => {
        const title = list.title;
        const tasks = list.tasks.map((task) => {
          return (
            <span key={task.id} className="task-container">{ task.title }<br/></span>
          );
        });
        return { title, content: tasks }
      });
    }
    return (
      <div className="wunderlist-container">
        <b>WUNDERLIST</b>
        <HorizontalList items={items}/>
      </div>
    )
  }
}

export default Wunderlist;
