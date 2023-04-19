import { log } from "console";
import { useState, KeyboardEvent, ChangeEvent } from "react";

type Props = {
  dictionary: Array<string>
  activatedCategories: Array<string>
  onSubmit: Function
}

type Suggestions = {
  elements: Array<string>
  currentIndex: number
}

const SearchBar = (props: Props) => {
  const [prefix, setPrefix] = useState("");
  const [displayInvalidInput, setDisplayInvalidInput] = useState(false);

  const unusedCategories: Array<string> = props.dictionary.filter((elem) => {
    return !props.activatedCategories.includes(elem);
  })

  const [suggestions, setSuggestions] = useState<Suggestions>({elements: ["", ...unusedCategories], currentIndex: 0});

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

    let newElements: Array<string>;
    if (value === "") {
      newElements = ["", ...unusedCategories];
    } else {
      newElements =[...findPrefix(value), ""]; 
    }

    setSuggestions({elements: newElements, currentIndex: 0});
    setDisplayInvalidInput(false);
  }

  // Handler for key pressing.
  const keyDownHandler = (event: KeyboardEvent<HTMLInputElement>): void => {
    switch (event.key) {
      case "ArrowDown":
        const nextIndex = suggestions.currentIndex === suggestions.elements.length - 1 ? 0 : suggestions.currentIndex + 1;
        setSuggestions({...suggestions, currentIndex: nextIndex});
        break;
      case "ArrowRight":
        const value = suggestions.elements.length === 0 ? "" : suggestions.elements[suggestions.currentIndex];
        if (value !== "") {
          setPrefix(value);
        }
        setDisplayInvalidInput(false);
        setSuggestions({elements: ["", ...findPrefix(value)], currentIndex: 0});
        break;
      case "Enter":
        const isValid = unusedCategories.includes(prefix.toLowerCase());
        if (isValid) {
          props.onSubmit(prefix.toLowerCase())
          setPrefix("");
        }
        setSuggestions({elements: ["", ...unusedCategories.filter((e) => {return e !== prefix;})], currentIndex: 0});
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
        value={suggestions.elements.length === 0 ? "" : suggestions.elements[suggestions.currentIndex]}
        readOnly={true}
        style={displayInvalidInput ? { borderColor: "red" } : { borderColor: 'transparent' }}
      />
    </div>
  );
}

export default SearchBar;
