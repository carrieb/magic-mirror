import moment from 'moment-timezone';

function getWeekdayLowercase(m) {
  return m.format('dddd').toLowerCase();
}

function getCurrentWeek() {
  const now = moment().startOf('day');
  const weekInFuture = moment().add(6, 'days');

  const days = [];
  while (now.isBefore(weekInFuture)) {
    days.push(getWeekdayLowercase(now))
    now.add(1, 'days');
  }

  console.log(days);
  return days;
}

module.exports = {
  getCurrentWeek
}
