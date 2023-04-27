import { useState } from "react";
import SoundClassFilterItem, { FilterItem } from "./SoundClassFilterItem";
import SearchBar from "./SearchBar";
import { log } from "console";
import { CATEGORIES } from "./Categories";
import CATS from './TempCategoryFetch.json';
import { CANCELLED } from "dns";
export type { FilterItem } from "./SoundClassFilterItem";

const STYLE_NAMESPACE = "soundClassFilterInput__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
  Header = STYLE_NAMESPACE + "header",
  Input = STYLE_NAMESPACE + "input",
  List = STYLE_NAMESPACE + "list",
  ListContainer = STYLE_NAMESPACE + "listContainer",
  ListHeader = STYLE_NAMESPACE + "listHeader"
}

type Props = {
  onChange: Function;
}

/**
 * Generates a list of all category names to use in autocompletion.
 */
let DICTIONARY: Array<string> = [];
for (let elem = 0; elem < CATEGORIES.length; elem++) {
  DICTIONARY = [...DICTIONARY, CATEGORIES[elem].name.toLocaleLowerCase()];
}

/**
 * Updates certainty level in CATEGORIES of those categories that where fetched from db.
 * TODO: Ability to be called on when new soundClip is shown.
 */
for (let elem = 0; elem < CATS.CATS.length; elem++) {
  let locInList = CATEGORIES.findIndex((category => category.name === CATS.CATS[elem].name));
  CATEGORIES[locInList].certaintyLevel = CATS.CATS[elem].certaintyLevel;
}

// Initial content of the categorylist showing, determined by relevance.
const THRESHOLD = 50;
const VALIDCATEGORIES = CATEGORIES.filter((category) => {
  return category.certaintyLevel >= THRESHOLD;
})


const SoundClassFilterInput = (props: Props) => {

  const [activatedCategories, setActivatedCategories] = useState(
    VALIDCATEGORIES.map((category) => {
      return category.name.toLowerCase();
    })
  )

  const categories: Array<FilterItem> = CATEGORIES.filter((item) => {
    return activatedCategories.includes(item.name.toLowerCase());
  })

  // When a category is deleted.
  const deleteItemHandler = (name: string) => {
    const temp = activatedCategories.filter((elem) => {
      return elem !== name.toLowerCase();
    })
    setActivatedCategories(temp);
  }

  // When a category is appended when the user presses enter.
  const addCategoryHandler = (name: string) => {
    const temp = [...activatedCategories, name];
    setActivatedCategories(temp);
  }

  return (
    <div className={Style.Container}>
      <div className={Style.Header}>Filtrering</div>
      <SearchBar dictionary={DICTIONARY} activatedCategories={activatedCategories} onSubmit={addCategoryHandler} />
      <div className={Style.ListContainer}>
        <div className={Style.ListHeader}>Aktiva filter</div>
        <div className={Style.List}>
          <ul>
            {categories.map((item) => (
              <SoundClassFilterItem
                key={item.id}
                filterProperties={item}
                onDeleteItemHandler={deleteItemHandler}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SoundClassFilterInput;
