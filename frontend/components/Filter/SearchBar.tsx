import { log } from "console";
import { useState, KeyboardEvent, ChangeEvent } from "react";

type Props = {
  dictionary: Array<string>
  onSubmit: Function
}

const SearchBar = (props: Props) => {
  const [prefix, setPrefix] = useState("");
  const [suggestion, setSuggestion] = useState("");

  // Finds dictionary sentences matching with input string.
  const findPrefix = (input: string): string[] => {
    const dropdown: string[] = [];
    for (const word of props.dictionary) {
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
    var suggestions = findPrefix(value);
    var firstWord = suggestions[0];
    if (suggestions.length !== 0 && value.length !== 0) {
      setSuggestion(firstWord);
    } else {
      setSuggestion("Not an existing category!");
    }
  }

  // Handler for key pressing.
  const keyDownHandler = (event: KeyboardEvent<HTMLInputElement>): void => {
    switch (event.key) {
      case "ArrowDown":
        setPrefix(suggestion);
        break;
      case "Enter":
        if (props.dictionary.includes(prefix)) {
          props.onSubmit(prefix)
        } else {
          setSuggestion("Not an existing category!")
        }
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
      />
    </div>
  );
}

export default SearchBar;
