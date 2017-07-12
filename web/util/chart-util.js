import moment from 'moment-timezone';
import find from 'lodash/find';

const ChartUtil = {
  generateDateLabels(docs, format='M/D', fieldName='date', timezone='UTC') {
    // generate a list of last 7 days
    // map objs with UTC date to
    const today = moment();
    const curr = moment().subtract(7, 'days'); // six days ago
    let labels = [];
    while (curr <= today) {
      //console.log(curr, today);
      labels.push(curr.format(format));
      curr.add(1, 'day');
    }
    return labels;
  },

  generateDatasets(docs, dateLabels, format='M/D') {
    // later parametrize
    // 1 = coins
    let dateToWallet = {};
    dateLabels.forEach((label) => dateToWallet[label] = null);
    console.log(dateToWallet);
    docs.forEach((doc) => {
      const amount = find(doc.wallet, (currency) => currency.id === 1).value;
      const dateKey = moment(doc.date).format(format);
      dateToWallet[dateKey] = amount;
    });
    console.log(dateToWallet);
    const data = Object.keys(dateToWallet).map((date) => {
      return dateToWallet[date];
    });
    return [
      {
        label: 'Gold',
        data,
        borderColor: 'rgba(255, 215, 0, 0.8)',
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        spanGaps: true
      }
    ]
  }
}

export default ChartUtil;
