import React from 'react';
import ReactDOM from 'react-dom';
import ApiWrapper from '../util/api-wrapper';

import Chart from 'chart.js'
import ChartUtil from '../util/chart-util';

import isEqual from 'lodash/isEqual';
import min from 'lodash/min';
import max from 'lodash/max';

class GuildWars extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      wallet: [],
      achievements: [],
      walletHistory: [],
      chart: null
    };
  }

  componentWillMount() {
    ApiWrapper.getGuildWarsData((result) => {
      this.setState(result);
    });
    ApiWrapper.getGuildWarsWalletHistory((result) => {
      this.setState({ walletHistory: result });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevState.walletHistory, this.state.walletHistory)) {
      this.drawChart();
    }
  }

  drawChart() {
    if (this.state.chart) {
      // redraw
    } else {
      const labels = ChartUtil.generateDateLabels(this.state.walletHistory);
      const datasets = ChartUtil.generateDatasets(this.state.walletHistory, labels);
      console.log(datasets);
      //console.log(labels, datasets);
      const chart = new Chart(this.canvas, {
        type: 'line',
        data: {
          labels,
          datasets
        },
        options: {
          layout: {
            padding: 0
          },
          legend: {
            display: false
          },
          tooltips: {
            callbacks: {
              label: ((tooltipItem, data) => {
                const val = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                return `${val}G`;
              })
            }
          },
          scales: {
            yAxes: [{
              type: 'linear',
              ticks: {
                min: Math.floor(min(datasets[0].data)/10) * 10,
                max: Math.ceil(max(datasets[0].data)/10) * 10,
                callback: ((value, index, values) => value)
              }
            }],
            xAxes: [{
              ticks: {
                maxTicksLimit: 3
              }
            }]
          }
        }
      });
    }
  }

  render() {
    const achievements = this.state.achievements.filter((achievement) => {
      return achievement.level.max === 80;
    }).map((achievement) => {
      const achievementName = achievement.name.replace('Daily ', '');
      return <div className="achievement" key={achievement.id}>{achievementName}</div>
    });
    const currencies = new Set(['Coin', 'Karma', 'Unbound Magic']);
    const formatCurrency = (currency, value) => {
      switch (currency) {
        case 'Coin':
          return Math.floor(value/10000) + 'G';
        case 'Karma':
          return Math.floor(value/10000)/100 + 'K';
        default:
          return value;
      }
    };
    const wallet = this.state.wallet.filter((currency) => {
      return currencies.has(currency.name);
    }).map((currency) => {
      return (
        <div className="statistic" key={currency.id}>
          <div className="value">
            <img src={currency.icon} className="ui mini circular inline image"/>
            { formatCurrency(currency.name, currency.value) }
          </div>
          <div className="label">
            { currency.name === 'Unbound Magic' ? 'Magic' : currency.name }
          </div>
        </div>
      )
    });

    // IDEA: Radar chart character for stats? :) :)
    return (
      <div className="guild-wars-container">
        <div className="header"><b>GUILD WARS</b></div>
        { achievements }
        <div className="ui tiny statistics">
          { wallet }
        </div>
        <canvas width="400" height="200" ref={(ref) => { this.canvas = ref }}></canvas>
      </div>
    )
  }
}

export default GuildWars;
