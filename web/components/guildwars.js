import React from 'react';
import ApiWrapper from '../util/api-wrapper';

const GuildWars = React.createClass({
  componentWillMount() {
    ApiWrapper.getGuildWarsData((result) => {
      this.setState(result);
    });
  },

  getInitialState() {
    return {
      wallet: [],
      achievements: []
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
    return (
      <div className="guild-wars-container">
        <div className="header"><b>GUILD WARS</b></div>
        { achievements }
        { wallet }
      </div>
    )
  }
});

export default GuildWars;
