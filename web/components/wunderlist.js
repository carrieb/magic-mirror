import React from 'react';

import ApiWrapper from '../util/api-wrapper';

const Wunderlist = React.createClass({
  getInitialState() {
    return {
      loaded: false,
      lists: [] /* an obj { title, tasks } */
    }
  },

  componentWillMount() {
    ApiWrapper.getWunderlist((lists) => {
      this.setState({
        loaded: true,
        lists
      });
    });
  },

  render() {
    let lists;
    if (this.state.loaded) {
      const listEls = this.state.lists.map((list) => {
        const tasks = list.tasks.map((task) => {
          return (
            <span key={task.id} className="task-container">{ task.title }<br/></span>
          );
        });
        return [
            <dt>{ list.title }</dt>,
            <dd>{ tasks }</dd>
        ];
      });
      lists = (
        <dl className="lists-container dl-horizontal">
          { listEls }
        </dl>
      );
    }
    return (
      <div className="wunderlist-container">
        <b>WUNDERLIST</b>
        { lists }
      </div>
    )
  }
});

export default Wunderlist;
