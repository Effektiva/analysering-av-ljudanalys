import { log } from "console";
import { useState, KeyboardEvent, ChangeEvent } from "react";

type Props = {
  dictionary: Array<string>
  activatedCategories: Array<string>
  onSubmit: Function
}

class Suggestions {
  elements: Array<string> = [];
  index: number = 0;

  setElements(input: Array<string>) {
    this.elements = input;
    this.index = 0;
  }

  getCurrentSuggestion() {
    if (this.elements.length === 0) {
      return "";
    }
    return this.elements[this.index];
  }

  getNextSuggestion() {
    if (this.elements.length === 0) {
      return "";
    } else {
      this.index++;
      if (this.elements.length <= this.index) {
        this.index = 0;
      }
      console.log(this.index);
      return this.elements[this.index];
    }
  }
}

let suggestions = new Suggestions();

const SearchBar = (props: Props) => {
  const [prefix, setPrefix] = useState("");
  const [suggestion, setSuggestion] = useState<string>();
  const [displayInvalidInput, setDisplayInvalidInput] = useState(false);

  const unusedCategories: Array<string> = props.dictionary.filter((elem) => {
    return !props.activatedCategories.includes(elem);
  })

  // Finds dictionary sentences matching with input string.
  const findPrefix = (input: string): Array<string> => {
    const dropdown: Array<string> = [];
    for (const word of unusedCategories) {
      if (word.toLowerCase().startsWith(input.toLowerCase())) {
        dropdown.push(word);
      }
    }
    return dropdown;
  }

  // This executes whenever anything is typed to the promt.
  const changeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    var value = event.target.value;
    setPrefix(value);
    if (value.length !== 0) {
      suggestions.setElements(findPrefix(value));
    }
    setDisplayInvalidInput(false);
  }

  // Handler for key pressing.
  const keyDownHandler = (event: KeyboardEvent<HTMLInputElement>): void => {
    switch (event.key) {
      case "ArrowDown":
        setSuggestion(suggestions.getNextSuggestion())
        break;
      case "ArrowRight":
        const value = suggestions.getCurrentSuggestion();
        setPrefix(value);
        setDisplayInvalidInput(false);
        suggestions.setElements(findPrefix(value));
        break;
      case "Enter":
        const isValid = unusedCategories.includes(prefix.toLowerCase());
        if (isValid) {
          props.onSubmit(prefix.toLowerCase())
          setPrefix("");
          setSuggestion("");
          suggestions.setElements([]);
        }
        setDisplayInvalidInput(!isValid);
        break;
    }
  }

  return (
    <div>
      <input
        type="text"
        name="search-bar"
        id="search-bar"
        placeholder="Search..."
        value={prefix}
        onChange={changeHandler}
        onKeyDown={keyDownHandler}
      />

      <input
        type="text"
        name="search-bar"
        id="search-bar2"
        value={suggestion}
        readOnly={true}
        style={displayInvalidInput ? { borderColor: "red" } : { borderColor: 'transparent' }}
      />
    </div>
  );
}

export default SearchBar;
