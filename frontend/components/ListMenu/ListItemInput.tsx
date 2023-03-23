import { ListEvent, ItemType, ListEventResponse } from "./ListMenu";

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
  const onChangeHandler = (event: React.KeyboardEvent) => {
    let response: ListEventResponse = {
      event: ListEvent.UndefinedEvent,
      value: (event.target as HTMLInputElement).value,
      id: props.id,
      parentID: props.parent,
    }

    if (event.key == "Enter") {
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
        className="listItemInput"
        type="text"
        defaultValue={props.text}
        onKeyDown={onChangeHandler}
      />
    </>
  )
}

