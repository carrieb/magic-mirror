import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';

import 'sass/meals/calendar.scss';

const end_ts = 1542931200; // thanksgiving @ 6 p.m.
const start_ts = 1542466800; // sat before @ 9 a.m.

class PlanningCalendar extends React.Component {
  render() {
    // TODO: given recipe ids array,
    // fetch recipes
    // convert recipes into day events?
    // ... based on the directions sections?
    // ... hmm, that won't necessarily work, e.g. cake layers
    const events = {};
    const start = moment.unix(this.props.start || start_ts);
    const end = moment.unix(this.props.end || end_ts);

    events[moment.weekdays()[start.weekday()]] = [ {
      name: 'Start!',
      time: start,
      type: 'task'
    }, {
      name: 'Go shopping',
      time: moment('2018-11-17 11:00'),
      type: 'shopping'
    } ];

    events[moment.weekdays()[end.weekday()]] = [ {
      name: 'Meal time!',
      time: end
    } ];

    events['Sunday'] = [ {
      name: 'Bake entremet',
      time: moment('2018-11-18 11:00'),
      type: 'dessert'
    }]

    events['Wednesday'] = [ {
      name: 'Brine turkey',
      time: moment('2018-11-21 09:00'),
      recipe: {
        text: 'turkey',
        id: '5bcfd8fa23f52f24a6e5fe60'
      }
    }, {
      name: 'Cook Braised Cabbage',
      time: moment('2018-11-21 18:00'),
      recipe: {
        text: 'Braised Cabbage',
        id: '5bcfde4a23f52f24a6e5fe61'
      }
    } ];

    events['Tuesday'] = [ {
      name: 'Assemble Spinach Gratin',
      time: moment('2018-11-20 18:00'),
      recipe: {
        text: 'Spinach Gratin',
        id: '5a2c92e9a13773d717c0bcd0'
      }
    } ];

    events['Monday'] = [ {
      name: 'Thaw turkey',
      time: moment('2018-11-19 09:00'),
      recipe: {
        text: 'turkey',
        id: '5bcfd8fa23f52f24a6e5fe60'
      },
      type: 'thaw'
    } ];

    console.log(events);

    const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    const columns = days.map((day) => {
      const dayEvents = events[day];

      let content;
      if (dayEvents) {
        const timelineEvents = dayEvents.map((ev, i) => {
          let name = <span>{ ev.name }</span>;
          if (ev.recipe) {
            const idx = ev.name.indexOf(ev.recipe.text);

            const prefix = ev.name.substring(0, idx);
            const rest = ev.name.substring(idx + ev.recipe.text.length);
              name = (
                <span>
                  { prefix }
                  <a href={`/recipes/r/${ev.recipe.id}`}>{ ev.recipe.text }</a>
                  { rest }
                </span>
              );
          }

          return (
            <div key={i} className={`event ${ev.type ? '' : 'bullet'}`}>
              { ev.type && <img className={ev.type} src={`/images/meals/${ev.type}-icon.png`}/> }
              <div className="details">
                <div className="block">
                  <b>{ ev.time.format('h:mm A') }</b><br/>
                  { name }
                </div>
              </div>
            </div>
          );
        })
        content = (
          <div className="content">
            <div className={`vertical-timeline ${day === 'Thursday' ? 'reversed' : ''}`}>
              { timelineEvents }
            </div>
          </div>
        );
      }

      return (
        <div className="column" key={day}>
          <div className="header">{day}</div>
          { content }
        </div>
      );
    });

    return (
      <div className="ui internally celled grid planning-calendar">
        <div className="six column row">
          { columns }
        </div>
      </div>
    );
  }
}

PlanningCalendar.propTypes = {
  start: PropTypes.number,
  end: PropTypes.number
}

export default PlanningCalendar;
