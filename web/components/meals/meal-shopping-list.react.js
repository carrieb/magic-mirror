import React from 'react';

import StickyHeaderMenu from 'components/common/sticky-header-menu.react';
import FixedFooter from 'components/common/fixed-footer.react';
import ShoppingListDisplay from 'components/shared/shopping-list-display.react';

import { withRecipes } from 'state/RecipesState';

import { combineQuantities, parseAmount } from 'src/common/quantities';

import _flatten from 'lodash/flatten';
import _sortBy from 'lodash/sortBy';
import _find from 'lodash/find';

class MealShoppingList extends React.Component {
  state = {
    categorize: true
  }

  combineRecipeIngredients() {
    const shoppingList = {};
    const failedToCombine = {};

    this.props.ids.map((id) => {
      const recipe = this.props.recipesIndex[id];
      const sections = recipe.ingredients;

      const ingredients = _flatten(sections.map(s => s.items));
      ingredients.forEach((ingr) => {
        const name = ingr.name;
        const listItem = shoppingList[name];

        if (listItem) {
          const combined = combineQuantities(listItem.quantity, ingr.quantity);
          //console.log(combined);
          if (combined) {
            listItem.quantity = combined;
            if (!_find(listItem.recipes, r => r.id === id)) {
              listItem.recipes.push({ name: recipe.name, id });
            }
          } else {
            if (!failedToCombine[name]) {
              failedToCombine[name] = [];
            }

            failedToCombine[name].push(ingr.quantity);
          }
        } else {
          shoppingList[name] = ingr;
          shoppingList[name].recipes = [{ name: recipe.name, id }];
          shoppingList[name].quantity.amount = parseAmount(shoppingList[name].quantity.amount);
        }
      });

      // todo: compress ingredients? e.g. egg whites + egg yolks?
    });

    //console.log('shopping list:', shoppingList);
    //console.log('failed to combine:', failedToCombine);
    return { shoppingList, failedToCombine };
  }

  render() {
    let content = null;

    if (this.props.recipes.length === 0) {
      // TODO: placeholder? loading?
      content = null;
    } else {
      const { shoppingList, failedToCombine } = this.combineRecipeIngredients();
      content = <ShoppingListDisplay items={ _sortBy(Object.values(shoppingList), 'name')}
                                     categorize={this.state.categorize}/>
    }

    return (
      <div className="ui basic segment meal-shopping-list"
           style={{ marginBottom: '100px', padding: 0 }}>
        <StickyHeaderMenu>
          <button className="ui basic icon red button">
            <i className="clipboard list icon"/>
            Export to Wunderlist
          </button>
        </StickyHeaderMenu>
        { content }
      </div>
    );
  }
}

export default withRecipes(MealShoppingList);
