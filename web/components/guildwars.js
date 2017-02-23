import React from 'react';
import ReactDOM from 'react-dom';
import ApiWrapper from '../util/api-wrapper';

import Chart from 'chart.js'
import ChartUtil from '../util/chart-util';

import isEqual from 'lodash/isEqual';

const GuildWars = React.createClass({
  componentWillMount() {
    ApiWrapper.getGuildWarsData((result) => {
      this.setState(result);
    });
    ApiWrapper.getGuildWarsWalletHistory((result) => {
      this.setState({ walletHistory: result });
    });
  },

  getInitialState() {
    return {
      wallet: [],
      achievements: [],
      walletHistory: [],
      chart: null
    }
  },

  handleCanvasRef(ref) {
    this.canvas = ReactDOM.findDOMNode(ref);
  },

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevState.walletHistory, this.state.walletHistory)) {
      this.drawChart();
    }
  },

  drawChart() {
    if (this.state.chart) {
      // redraw
    } else {
      const labels = ChartUtil.generateDateLabels(this.state.walletHistory);
      const datasets = ChartUtil.generateDatasets(this.state.walletHistory, labels);
      console.log(labels, datasets);
      const chart = new Chart(this.canvas, {
        type: 'line',
        data: {
          labels,
          datasets
        },
        options: {
          layout: {
            padding: 20
          },
          legend: {
            display: false
          },
          tooltips: {
            callbacks: {
              label: ((tooltipItem, data) => {
                const val = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                return `${(val/10000).toFixed()}G`;
              })
            }
          },
          scales: {
            yAxes: [{
              type: 'linear',
              ticks: {
                min: 0,
                max: 4000000,
                callback: ((value, index, values) => value/10000)
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
  },

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
          return Math.floor(value/1000) + 'K';
        default:
          return value;
      }
    };
    const wallet = this.state.wallet.filter((currency) => {
      return currencies.has(currency.name);
    }).map((currency) => {
      return <div className="currency" key={currency.id}>{formatCurrency(currency.name, currency.value)}<img src={currency.icon}/></div>
    });

    // IDEA: Radar chart character for stats? :) :)
    return (
      <div className="guild-wars-container">
        <div className="header"><b>GUILD WARS</b></div>
        { achievements }
        { wallet }
        <canvas width="400" height="400" ref={this.handleCanvasRef}></canvas>
      </div>
    )
  }
});

export default GuildWars;
