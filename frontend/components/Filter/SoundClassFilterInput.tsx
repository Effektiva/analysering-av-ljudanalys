import { useState } from "react";
import SoundClassFilterItem, { FilterItem } from "./SoundClassFilterItem";
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

const CATEGORIES: Array<FilterItem> = [
  {
    id: 0,
    category: "Hund",
    certaintyLevel: 40
  },
  {
    id: 1,
    category: "Bil",
    certaintyLevel: 80
  },
  {
    id: 3,
    category: "Kebab",
    certaintyLevel: 85
  },
  {
    id: 4,
    category: "Haj",
    certaintyLevel: 60
  }
];

// TODO: Ensure that casing isn´t a problem!
const DICTIONARY: Array<string> = ["kebab", "bil", "hund", "haj"];

const SoundClassFilterInput = () => {

  // Initial content of the categorylist showing, determined by relevans.
  const threshold = 80;
  const validCategories = CATEGORIES.filter((category) => {
    return category.certaintyLevel >= threshold;
  })

  const [categories, setCategories] = useState(validCategories);

  // When a category is deleted.
  const deleteItemHandler = (id: number) => {
    const newFilter = categories.filter((item) => {
      return item.id !== id;
    });
    setCategories(newFilter)
  }

  // When a category is appended when the user presses enter.
  const addCategoryHandler = (category: string) => {
    const [categoryItem] = CATEGORIES.filter((item) => {
      return item.category.toLowerCase() === category;
    })
    setCategories([...categories, categoryItem]);
  }

  return (
    <div className={Style.Container}>
      <div className={Style.Header}>Filtrering</div>
      <SearchBar dictionary={DICTIONARY} onSubmit={addCategoryHandler} />
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
