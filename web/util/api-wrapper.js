import $ from 'jquery';

const noop = () => {}

import assign from 'lodash/assign';

let lastWeatherResponse = null;

const ApiWrapper = {
  getCurrentTemp(callback) {
    $.ajax('/api/weather')
     .done((res) => {
       //console.log('/weather response', res);
       callback(res.current_observation);
     });
  },

  getForecast(callback) {
    $.ajax('/api/forecast')
      .done((res) => {
        //console.log('/forecast response', res);
        callback(res.forecast.simpleforecast.forecastday);
      });
  },

  getWanikaniData(callback) {
    $.ajax('/api/wanikani')
      .done((res) => {
        //console.log('/wanikani response', res);
        callback(res);
      });
  },

  getWunderlist(callback) {
    $.ajax('/api/wunderlist')
      .done((res) => {
        //console.log('/wunderlist response', res);
        callback(res);
      });
  },

  getCalendars(callback) {
    $.ajax('/api/calendars')
     .done((res) => {
       //console.log('/calendars response', res);
       callback(res);
     });
  },

  getGuildWarsData(callback) {
    $.ajax('/api/guildwars')
     .done((res) => {
       //console.log('/guildwars response', res);
       callback(res);
     });
  },

  getGuildWarsWalletHistory(callback) {
    $.ajax('/api/guildwars/wallet')
    .done((res) => {
      //console.log('/guildwars/wallet response', res);
      callback(res);
    });
  },

  getKitchen() {
    return $.ajax('/api/kitchen')
      .done((res) => {
        //console.log('/kitchen response', res);
      })
      .fail((err) => alert(err));
  },

  searchUSDA(query) {
    return $.ajax('/api/usda/search', {
      type: 'POST',
      data: JSON.stringify({ query }),
      contentType: 'application/json; charset=utf-8'
    }).done((res) => {
        //console.log('/kitchen response', res);
      })
      .fail((err) => alert(JSON.stringify(err)));
  },

  retrieveUSDAData(ndbno) {
    return $.ajax(`/api/usda/retrieve?ndbno=${ndbno}`);
  },

  submitCrop(filename, crop, callback) {
    let data = { filename };
    data = assign(data, crop);
    $.ajax('/crop', {
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8'
    })
    .done((res) => {
      //console.log('/crop response', res);
      callback(res);
    });
  },

  extractText(filename) {
    return $.ajax('/extract', { data: { filename }});
  },

  submitItems(items) {
    return $.ajax('/items', {
      data: JSON.stringify({ items }),
      type: 'POST',
      contentType: 'application/json; charset=utf-8'
    });
  },

  submitFirebaseToken(token) {
    return $.ajax('/firebase-token', {
      data: JSON.stringify({ token }),
      type: 'POST',
      contentType: 'application/json; charset=utf-8'
    });
  },

  updateFood(food) {
    return $.ajax('/api/kitchen/food', {
      data: JSON.stringify({ item: food }),
      type: 'PUT',
      contentType: 'application/json; charset=utf-8'
    });
  },

  trashFood(id) {
    console.log(id)
    return $.ajax('/api/kitchen/trash', {
      data: JSON.stringify({ id }),
      type: 'DELETE',
      contentType: 'application/json; charset=utf-8'
    });
  },

  uploadFoodImage(form, onProgress=noop) {
    return $.ajax({
      url: '/api/kitchen/image',
      type: 'POST',
      data: new FormData(form),
      cache: false,
      contentType: false,
      processData: false,
      xhr: () => {
          var myXhr = $.ajaxSettings.xhr();
          if (myXhr.upload) {
              // For handling the progress of the upload
              myXhr.upload.addEventListener('progress', (e) =>{
                  if (e.lengthComputable) {
                      onProgress(e.loaded, e.total);
                  }
              } , false);
          }
          return myXhr;
      }
    });
  },

  uploadRecipe(recipe) {
    return $.ajax({
      url: '/api/recipes/add',
      type: 'POST',
      data: JSON.stringify({ recipe }),
      contentType: 'application/json; charset=utf-8'
    });
  },

  getRecipes() {
    return $.ajax({
      url: '/api/recipes/',
      type: 'GET',
      contentType: 'application/json; charset=utf-8'
    });
  },

  getRecipeById(id) {
    return $.ajax({
      url: `/api/recipes/${id}`,
      type: 'GET'
    });
  },

  searchRecipesByIngredient(ingredient) {
    return $.ajax({
      url: '/api/recipes/search',
      type: 'POST',
      data: JSON.stringify({ ingredient }),
      contentType: 'application/json; charset=utf-8'
    });
  },

  deleteRecipe(id) {
    return $.ajax({
      url: `/api/recipes/${id}`,
      type: 'DELETE'
    });
  },

  exportShoppingList(items) {
    return $.ajax({
      url: '/api/export/shopping-list',
      type: 'POST',
      data: JSON.stringify({ items }),
      contentType: 'application/json; charset=utf-8'
    });
  },

  star(id, starred) {
    return $.ajax({
      url: `/api/kitchen/star/${id}?s=${starred ? '1' : '0'}`,
      type: 'GET'
    });
  },

  getMeal(id) {
    return $.ajax({
      url: `/api/meals/meal?id=${id}`,
      type: 'GET'
    });
  }
}

export default ApiWrapper;
