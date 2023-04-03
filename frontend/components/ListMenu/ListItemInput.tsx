import { useState } from "react";
import { ListEvent, ItemType, ListEventResponse, StyleClass } from "./ListMenu";

type Props = {
  id: number,
  parent?: number,
  text: string,
  itemType?: ItemType,
  changeHandler: Function,
}

/**
 * This is basically just a replacement for the ListItem when we want to change the
 * text of an item in the list.
 */
export const ListItemInput = (props: Props) => {
  const [state, setState] = useState("");

  const onChangeHandler = (event: React.KeyboardEvent) => {
    const inputValue = (event.target as HTMLInputElement).value;

    let response: ListEventResponse = {
      event: ListEvent.UndefinedEvent,
      value: inputValue,
      id: props.id,
      parentID: props.parent,
    }

    if (event.key == "Enter") {
      if (inputValue == "") {
        setState(StyleClass.Invalid);
        return;
      }

      if (props.itemType == ItemType.Root) {
        response.event = ListEvent.ChangeTextOfRoot;
      } else {
        response.event = ListEvent.ChangeTextOfSubroot;
      }

      props.changeHandler(response);
    }
  }

  return (
    <>
      <input
        autoFocus
        className={"listItemInput " + state}
        type="text"
        defaultValue={props.text}
        onKeyDown={onChangeHandler}
      />
    </>
  )
}

