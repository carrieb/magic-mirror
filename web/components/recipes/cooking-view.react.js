import React from 'react';
import { withRouter } from 'react-router';

import { withRecipes } from 'state/RecipesState';

import 'sass/recipes/cooking-view.scss';

const actions = ['dice', 'chop', 'fry', 'boil', 'simmer', 'julienne', 'add', 'mix'];
const actionToIcon = {
  'dice': 'knife.png',
  'chop': 'knife.png',
  'fry': 'frying-pan.png',
  'julienne': 'knife.png'
}

const items = ['paper tower', 'pan'];

const CookingViewPlaceholder = () => <div className="ui placeholder cooking-view">
  <div className="paragraph">
    <div className="line"/>
    <div className="line"/>
    <div className="line"/>
    <div className="line"/>
    <div className="line"/>
    <div className="line"/>
    <div className="line"/>
  </div>
</div>;

class CookingView extends React.Component {
  state = {
    currentSectionIdx: 0,
    currentStepIdx: 0
  }

  pause = () => {

  }

  next = () => {
    // TODO: handle section changes
    this.setState({ currentStepIdx: this.state.currentStepIdx + 1 });
  }

  back = () => {
    this.setState({ currentStepIdx: this.state.currentStepIdx - 1 });
  }

  render() {
    const id = this.props.match.params.id;
    const recipe = this.props.recipesIndex[id];

    console.log('cooking view: recipe', recipe);

    if (!recipe) {
      return <CookingViewPlaceholder/>;
    }

    const allIngredients = new Set();
    const allSections = new Set();
    const ingredientIndex = {};
    recipe.ingredients.forEach(section => {
      if (section.name && section.name !== 'default') {
        allSections.add(section.name)
      }

      section.items.forEach(item => {
        if (allIngredients.has(item.name)) {
          // TODO: update quantities in index
        } else {
          allIngredients.add(item.name);
          ingredientIndex[item.name] = item;
        }
      })
    });

    console.log('ingredients', allIngredients, ingredientIndex);
    console.log('sections', allSections);

    const currentSectionIdx = this.state.currentSectionIdx; //  TODO: default this, store new one in local storage?
    const currentStepIdx = this.state.currentStepIdx; // TODO: default this, store new one in local storage?

    const currentSection = recipe.directions[currentSectionIdx];
    const currentStep = currentSection.steps[currentStepIdx];


    console.log('cooking view current', currentSection, currentStep);

    const allWords = new Set();
    currentStep.content.split(' ').forEach(word => allWords.add(word.toLowerCase()));
    console.log('words', allWords);

    const subcontent = [];
    actions.forEach(action => {
      if (allWords.has(action)) {
        subcontent.push(<div key={action} className={`ui card action ${action}`}>
          <div className="center aligned content">
            <img className="ui image" src={`/images/recipes/${actionToIcon[action]}`}/>
          </div>
          <div className="content">
            <div className="center aligned title">{ action }</div>
            <div>&nbsp;</div>
          </div>
        </div>);
      }
    });

    allIngredients.forEach(ingrName => {
      // have to use indexOff since ingrName's can be longer than one word
      if (currentStep.content.toLowerCase().indexOf(ingrName.toLowerCase()) > -1) {
        const ingredient = ingredientIndex[ingrName];
        // TODO: replace with an ingredient view using already saved image? and where it is?
        subcontent.push(<div key={ingrName} className="ui card ingredient">
          <div className="center aligned content">
            <img className="ui image" src={`/food-images/${ingrName}.jpeg`}/>
          </div>
          <div className="content">
            <div className="center aligned title">{ ingrName }</div>
            <div className="center aligned">
              { ingredient.quantity.amount } { ingredient.quantity.unit }
            </div>
          </div>
        </div>);
      }
    });

    allSections.forEach(sectionName => {
      // have to use indexOff since sectionName's can be longer than one word
      if (currentStep.content.toLowerCase().indexOf(sectionName.toLowerCase()) > -1) {
        subcontent.push(<div key={sectionName} className="ui card section">
          <div className="content">
            <div className="center aligned title">{ sectionName }</div>
          </div>
        </div>);
      }
    })

    console.log('content cards', subcontent);

    return (
      <div className="cooking-view">

        <div className="ui massive message">
          { currentStep.content }
        </div>

        { subcontent && <div className="ui four cards">{ subcontent }</div> }


        { currentStepIdx > 0 && <button className="ui huge fluid basic violet icon button" onClick={this.back}>
            <i className="left icon"/>
            Back
          </button> }

        <button className="ui huge fluid basic orange icon button" onClick={this.pause}>
          <i className="pause icon"/>
          Pause
        </button>

        { currentStepIdx < currentSection.steps.length - 1 && <button className="ui huge fluid basic green icon button" onClick={this.next}>
            <i className="right icon"/>
            Next
          </button> }
      </div>
    );
  }

}

export default withRouter(withRecipes(CookingView));
