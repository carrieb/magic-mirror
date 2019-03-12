import Polyglot from 'node-polyglot';
import LocalStorageUtil from 'util/local-storage-util';

let hl = LocalStorageUtil.getLocale() || 'en';
console.log(hl);
$("html").attr("lang", hl);

const en = new Polyglot({
  allowMissing: true,
  locale: 'en_US',
  phrases: {
    nav: {
      meals: 'Meals',
      kitchen: 'Kitchen',
      recipes: 'Recipes',

      actions: {
        okay: 'Looks Good!'
      }
    },

    tabs: {
      meal: {
        'recipes': 'Recipes',
        'schedule': 'Schedule',
        'shopping': 'Shopping'
      }
    },

    meals: {
      names: {
        'Thanksgiving': 'Thanksgiving'
      }
    },

    quantities: {
      units: {
        'g': '%{smart_count} g',
        'gram': '%{smart_count} gram |||| %{smart_count} grams',
        'oz': '%{smart_count} oz',
        'ounce': '%{smart_count} ounce |||| %{smart_count} ounces',
        'cup': '%{smart_count} cup |||| %{smart_count} cups',
        'tsp': '%{smart_count} tsp',
        'teaspoon': '%{smart_count} teaspoon |||| %{smart_count} teaspoons',
        'tbsp': '%{smart_count} tbsp',
        'tablespoon': '%{smart_count} tablespoon |||| %{smart_count} tablespoon',
        'ml': '%{smart_count} ml',
        'sprigs': '%{smart_count} sprig |||| %{smart_count} sprigs',
        'lb': '%{smart_count} lb',
        'pkg': '%{smart_count} pkg',
        'leaves': '%{smart_count} leaf |||| %{smart_count} leaves',
        'gallon': '%{smart_count} gallon |||| %{smart_count} gallons'
      },

      inventory: '%{quantity} in inventory'
    },

    recipes: {
      text: {
        'servings': '%{smart_count} serving |||| %{smart_count} servings',
        'search_placeholder': 'Search Recipes...',
        'parsing_rules': {
          'header': 'Ingredient Parsing Rules',
          'quantities': 'Quantities must be listed first.',
          'modifiers': 'Modififers should go in parens.'
        }
      },

      categories: {
        'Main Dish': '',
        'Side Dish': '',
        'Sauce': '',
        'Dessert': ''
      },

      names: {
        'Roast Turkey': '',
        'Spinach Gratin': '',
        'Braised Red Cabbage with Apples': '',
        'Cranberry Sauce': '',
        'Sophie\'s Ode to the Honey Bee Entremet': ''
      }
    },

    ingredients: {
      text: '%{quantity} of %{modifier} %{name} |||| %{quantity}s of %{modifier} %{name}',

      categories: {
        'dry-goods': 'Dry Goods',
        'produce': 'Produce',
        'meat': 'Meat',
        'sauce': 'Sauce',
        'spice': 'Spice',
        'dairy': 'Dairy',
        'leftovers': 'Leftovers',
        'drink': 'Drink',
        'condiment': 'Condiment',
        'other': ''
      },

      names: {
        'Cucumber Dill Cheese': '',
        'Honey': '',
        'Flour': '',
        'Baking Soda': '',
        'Baking Powder': '',
        'Ground Cloves': '',
        'Ground Allspice': '',
        'Vegetable Oil Spray': '',
        'Arctic Herb Salt': '',
        'Ground Nutmeg': '',
        'Cumin': '',
        'Paprika': '',
        'Ground Ginger': '',
        'Ground Cinnamon': '',
        'Oregano': '',
        'Dried Thyme Leaves': '',
        'Smoked Paprika': '',
        'Blacked Sesame Seed': '',
        'Sesame Seed': '',
        'Chili Powder': '',
        'Granulated Chicken Bouillon': '',
        'Kosher Salt': '',
        'Corn Syrup': '',
        'Ground Pepper': '',
        'Roasted Tomatillo Pepper Sauce': '',
        'Ikea Savoury Sauce Mix': '',
        'Molasses': '',
        'Sugar': '',
        'Brown Sugar': '',
        'Powdered Sugar': '',
        'Potato Starch': '',
        'Mung Bean Seeds': '',
        'Alfalfa Sprout Seeds': '',
        'sake': '',
        'Rice Vinegar': '',
        'Sesame Oil': '',
        'mirin': '',
        'Oyster Sauce': '',
        'Chili Oil': '',
        'Chili Paste': '',
        'Soy Sauce': '',
        'A1 Thick & Hearty Sauce': '',
        'Worcestershire Sauce': '',
        'Ground Mustard': '',
        'French Mustard': '',
        'Ranch': '',
        'Mayonaise': '',
        'Wasabi': '',
        'Brown Mustard': '',
        'Dijon Mustard': '',
        'Ikea Meatballs': '',
        'Ikea Veggie Balls': '',
        'Cabbage': '',
        'Eggplant': '',
        'Ikea Mashed Potatoes': '',
        'Potato Croquettes': '',
        'Chocolate Mochi Ice Cream': '',
        'Shrimp': '',
        'Ground Pork': '',
        'Vegetable Egg Rolls': '',
        'Eggos': '',
        'Bacon': '',
        'Ramen Noodles': '',
        'Butter': '',
        'Heavy Cream': '',
        'Cream Cheese': '',
        'Pickled Ginger': '',
        'Miso': '',
        'Minced Garlic': '',
        'Doubanjiang': '',
        'Grapes': '',
        'Blackberry Jam': '',
        'Apricot Preserves': '',
        'Lingonberry Jam': '',
        'Daikon Kimchi': '',
        'Eggs': '',
        'Green Onion': '',
        'Cilantro': '',
        'Homemade Saurkraut': '',
        'Sunny D': '',
        'Lemon': '',
        'Havarti Cheese': '',
        'Coffee Jelly': '',
        'Celery': '',
        'Mandarin Oranges': '',
        'Parmesan Cheese': '',
        'Guyere Cheese': '',
        'Pecorino Cheese': '',
        'Yellow Onion': '',
        'Pomegranate Seed': '',
        'String Cheese': '',
        'Sesame-Soy Cucumbers': '',
        'brisket': '',
        'Ice Pops': '',
        'Chicken Thigh': '',
        'Central Market Chicken Korma': '',
        'Saffron Road Chicken Biryani': '',
        'fish sauce': '',
        'plum vinegar': '',
        'extra virgin olive oil': '',
        'Olive Oil': '',
        'Orange Blossom Honey': '',
        'Vegetable Stock': '',
        'black peppercorn': '',
        'Ground Saigon Cinnamon': '',
        'Candied Ginger': '',
        'Spinach': '',
        'Balsamic Vinegar': '',
        'Corn Meal': '',
        'Light Brown Sugar': '',
        'Canola Oil': '',
        'Buttermilk': '',
        'Allspice Berry': ''
      }
    }
  }
});

const jp = new Polyglot({
  allowMissing: true,
  locale: 'jp',
  phrases: {
    nav: {
      meals: '食事',
      kitchen: '台所',
      recipes: 'レシピ',
      inventory: '在荷',

      actions: {
        import: '輸入',
        add: '作る',
        parse: '解析',
        okay: 'いいです!'
      }
    },

    tabs: {
      meal: {
        'recipes': 'レシピ',
        'schedule': '日程',
        'shopping': '買い物'
      }
    },

    table: {
      column: {
        name: '名前',
        recipes: 'レシピ',
        category: '種類',
        amount: '量'
      }
    },

    quantities: {
      units: {
        'g': '%{smart_count}g',
        'gram': '%{smart_count}グラム',
        'oz': '%{smart_count}oz',
        'ounce': '%{smart_count}オンス',
        'cup': '%{smart_count}カップ',
        'tsp': '%{smart_count}小さじ',
        'teaspoon': '%{smart_count}}小さじ',
        'tbsp': '%{smart_count}大さじ',
        'tablespoon': '%{smart_count}大さじ',
        'ml': '%{smart_count}ml',
        'sprigs': '%{smart_count}つの枝',
        'lb': '%{smart_count}lb',
        'pkg': '%{smart_count}パッケージ',
        'leaves': '%{smart_count}葉',
        'gallon': '%{smart_count}ガロン'
      },

      inventory: '%{quantity}を持ってる'
    },

    meals: {
      names: {
        'Thanksgiving': '感謝祭',
        'breakfast': '朝ご飯',
        'lunch': '昼ご飯',
        'dinner': '晩ご飯'
      }
    },

    calendar: {
      days: {
        'monday': '月曜日',
        'tuesday': '火曜日',
        'wednesday': '水曜日',
        'thursday': '木曜日',
        'friday': '金曜日',
        'saturday': '土曜日',
        'sunday': '日曜日'
      }
    },

    recipes: {
      text: {
        servings: '%{smart_count}人分',
        'search_placeholder': 'レシピ検索...',
        'parsing_rules': {
          'header': '材料構文規則',
          'quantities': '文の初めには分量',
          'modifiers': '修飾語はかっこに入れなさい'
        }
      },

      tools: {
        'bag': '袋',
        'pot': '鍋',
        'heat': '火'
      },

      fields: {
        'name': '名前',
        'source': '出典',
        'ingredients': '材料',
        'directions': '作り方'
      },

      categories: {
        'main dish': '主菜',
        'side dish': 'おかず',
        'sauce': 'ソース',
        'dessert': 'デザート'
      },

      names: {
        'Roast Turkey': '焼き七面鳥',
        'Spinach Gratin': 'ほうれん草グラタン',
        'Braised Red Cabbage with Apples': '蒸し煮赤キャベツとりんご',
        'Cranberry Sauce': 'クランベリーソース',
        'Sophie\'s Ode to the Honey Bee Entremet': 'ソフィの「蜜蜂の賛美歌」アントルメ'
      }
    },

    inventory: {
      zones: {
        'fridge': '冷蔵庫',
        'freezer': '冷凍こ',
        'pantry': 'パントリー'
      },

      cta: {
        'show me everything': '全部見る',
        'expand filters': '絞り込みルールを見る',
        'close filters': '絞り込みルールを隠す',
        'expand options': 'オプションを見る',
        'close options': 'オプションを隠す'
      }
    },

    ingredients: {
      text: '%{quantity} %{name} %{modifier}',

      categories: {
        'dry goods': '穀類',
        'produce': '農産物',
        'meat': '肉',
        'sauce': 'ソース',
        'spice': '香辛料',
        'dairy': '乳製品',
        'leftovers': '残飯',
        'drink': '飲み物',
        'condiment': '調味料',
        'other': '他の物'
      },

      names: {
        'cucumber cill cheese': 'きゅうりディルチーズ',
        'honey': '蜂蜜',
        'flour': '小麦粉',
        'baking soda': '重炭酸ソーダ',
        'baking powder': 'ふくらし粉',
        'bround cloves': 'クローブ',
        'ground allspice': 'オールスパイス',
        'allspice': 'オールスパイス',
        'vegetable oil spray': 'サラダ油スプレー',
        'arctic herb salt': '北極ハーブ塩',
        'ground nutmeg': 'ナツメグ',
        'cumin': 'クミン',
        'paprika': 'パプリカ',
        'ground ginger': 'ジンジャー',
        'ground cinnamon': 'シナモン',
        'oregano': 'オレガノ',
        'dried thyme leaves': '干しタイム葉',
        'smoked paprika': '燻パプリカ',
        'blacked sesame seed': '黒ごま',
        'sesame seed': '白ごま',
        'chili powder': 'チリパウダー',
        'granulated chicken bouillon': 'チキンブリオン',
        'kosher salt': '粗塩',
        'corn syrup': 'コーンシロップ',
        'ground pepper': 'こしょう',
        'Roasted Tomatillo Pepper Sauce': '焼きトマティオペッパーソース',
        'Ikea Savoury Sauce Mix': 'イケアのミートボールソース',
        'molasses': '糖みつ',
        'sugar': '砂糖',
        'brown sugar': '黒砂糖',
        'powdered sugar': '粉砂糖',
        'potato starch': '片栗粉',
        'mung bean seeds': '緑豆',
        'alfalfa sprout seeds': 'アルファルファ種',
        'sake': '酒',
        'rice vinegar': '酢',
        'sesame oil': 'ごま油',
        'mirin': 'みりん',
        'oyster sauce': 'オイスターソース',
        'chili oil': 'ラー油',
        'chili paste': 'チリペースト',
        'soy sauce': '醤油',
        'a1 thick & hearty sauce': 'A1のソース',
        'worcestershire sauce': 'ウスターシャーシーソース',
        'ground mustard': 'すりおろしマスタード',
        'french mustard': 'フレンチマスタード',
        'ranch': 'ランチドレッシング',
        'mayonaise': 'マヨ',
        'wasabi': 'わさび',
        'brown mustard': '茶色マスタード',
        'dijon mustard': 'ジジョンマスタード',
        'ikea meatballs': 'イケアのミートボール',
        'ikea veggie balls': 'イケアの野菜ボール',
        'cabbage': 'キャベツ',
        'eggplant': 'なす',
        'ikea mashed potatoes': 'イケアのマッシュポテト',
        'potato croquettes': 'ポテトコロッケ',
        'chocolate mochi ice cream': 'チョロレットもちアイス',
        'shrimp': 'えび',
        'ground pork': 'ひき豚肉',
        'vegetable egg rolls': '春巻き',
        'eggos': 'エッゴズ',
        'bacon': 'ベーコン',
        'ramen noodles': 'ら麺',
        'butter': 'バター',
        'heavy cream': 'ヘビークリーム',
        'cream cheese': 'クリームチーズ',
        'pickled ginger': '紅ショウガ',
        'miso': '味噌',
        'minced garlic': '短切りニンニク',
        'doubanjiang': '豆板醤',
        'grapes': 'ブドウ',
        'blackberry jam': 'ブラックベリージャム',
        'apricot preserves': '杏保存料',
        'lingonberry jam': 'リンゴンベリー',
        'daikon kimchi': '大根キムチ',
        'eggs': '卵',
        'green onion': 'ねぎ',
        'cilantro': 'コリアンダー',
        'homemade saurkraut': '手作りザウアークラウト',
        'sunny d': 'サーニーディー',
        'lemon': 'レモン',
        'havarti cheese': 'ハヴァルティチーズ',
        'coffee jelly': 'コーヒーゼリー',
        'celery': 'セロリ',
        'mandarin oranges': 'マンダリンオレンジ',
        'parmesean cheese': 'パルメザンチーズ',
        'guyere cheese': 'グリュイエールチーズ',
        'pecorino cheese': 'ペコリーノチーズ',
        'yellow onion': '玉ねぎ',
        'pomegranate seed': 'ザクロ種',
        'string cheese': 'ストリングチーズ',
        'sesame-soy cucumbers': 'ごま醤油胡瓜',
        'brisket': 'ブリズケット',
        'ice pops': 'アイスポップ',
        'chicken thigh': '鳥肉もも',
        'central market chicken korma': 'チキンコルマ',
        'saffron road chicken biryani': 'チキンビリヤニ',
        'fish sauce': '魚醤',
        'plum vinegar': '梅酢',
        'extra virgin olive oil': 'エクストラヴァージンオリーブオイル',
        'olive oil': 'オリーブオイル',
        'orange blossom honey': 'オレンジの花の蜂蜜',
        'vegetable stock': '野菜スープ',
        'black peppercorn': '黒コショウの実',
        'ground saigon cinnamon': 'サイゴンシナモン',
        'candied ginger': '砂糖漬けジンジャー',
        'spinach': 'ほうれん草',
        'balsamic vinegar': 'バルサミコ酢',
        'corn meal': 'コーンミール',
        'light brown sugar': 'きび砂糖',
        'canola oil': '菜種油',
        'buttermilk': 'バターミルク',
        'allspice berry': 'オールスパイス種',
        'agar-agar': '寒天',
        'apples': 'りんご',
        'blackberries': 'ブラックベリー',
        'caster sugar': '上白糖',
        'leaf gelatin': '葉ゼラチン',
        'nutmeg': 'ナツメグ',
        'salt': '塩',
        'pepper': 'こしょう',
        'cranberries': 'クランベリー',
        'frozen spinach': '冷凍ほうれん草',
        'lemon': 'レモン',
        'lemon juice': 'レモン汁',
        'onion': '玉ねぎ',
        'orange': 'オレンジ',
        'red apple': '赤いりんご',
        'red cabbage': '赤いキャベツ',
        'sage': 'セージ',
        'vanilla bean paste': 'ヴァニーラビーンペイスト',
        'whole milk': '全乳',
        'water': '水',
        'unsalted butter': '無塩バター',
        'turkey': '七面鳥',
        'rosemary': 'ローズマリー',
        'milk': '牛乳',
        'egg yolks': '卵黄',
        'egg whites': '卵白',
        'double cream': 'ダブルクリーム',
        'cinnamon stick': '桂皮',
        'orange blossom water': 'オレンジ花水'
      }
    }
  },
});

const locales = {
  en,
  jp
};

function tr(str, data, forcePolyglot=false) {
  //console.log(hl);
  const polyglot = locales[hl];
  try {
    if (hl === 'en' && !forcePolyglot) {
      const split = str.split('.');
      const last = split[split.length - 1];
      return last;
    } else {
      //console.log(str);
      const translated = polyglot.t(str.toLowerCase(), data);
      //console.log(translated);
      return translated;
    }
  } catch (e) {
    console.error(e);
    // ignore
  }
}

const TranslationUtil = {
  tr,

  phonetic(str, data, forcePolyglot) {
    if (hl === 'jp') {
      const translated = tr(str, data, forcePolyglot);
      return null;
    } else {
      return null;
    }
  },

  setLocale(newHl) {
    LocalStorageUtil.setLocale(newHl);
    $("html").attr("lang", newHl);
    location.reload();
  },

  getLocale() {
    return hl;
  }
};

module.exports = TranslationUtil;
