import _flatten from 'lodash/flatten';

const RecipeUtil = {
  getAllIngredients(recipe) {
    return _flatten(recipe.ingredients.map((section) => section.items));
  }
}

export default RecipeUtil;
