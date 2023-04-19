import { useState } from "react";
import SoundClassFilterItem, { FilterItem } from "./SoundClassFilterItem";
export type { FilterItem } from "./SoundClassFilterItem";
import SearchBar from "./SearchBar";
import { log } from "console";

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

const CATEGORIES: Array<FilterItem> = [
  {
    id: 0,
    name: "Hund",
    certaintyLevel: 40
  },
  {
    id: 1,
    name: "Bil",
    certaintyLevel: 80
  },
  {
    id: 3,
    name: "Kebab",
    certaintyLevel: 85
  },
  {
    id: 4,
    name: "Haj",
    certaintyLevel: 60
  },
  {
    id: 5,
    name: "Haja",
    certaintyLevel: 60
  }
];

// TODO: Ensure that casing isn´t a problem!
const DICTIONARY: Array<string> = ["kebab", "bil", "hund", "haj", "haja"];

// Initial content of the categorylist showing, determined by relevans.
const THRESHOLD = 80;
const VALIDCATEGORIES = CATEGORIES.filter((category) => {
  return category.certaintyLevel >= THRESHOLD;
})

const SoundClassFilterInput = () => {

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
