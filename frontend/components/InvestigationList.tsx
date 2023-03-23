import { useState } from "react";
import ListMenu, { ListEvent, ListEventResponse } from "./ListMenu/ListMenu";
import { ListItem } from "@/components/ListMenu/ListItem";
import ContextItem from "@/components/ContextMenu/ContextItem";
import { LOG as log } from "@/pages/_app";

type Props = {
  investigations: Array<ListItem>,
}

const CONTEXT_MENUS: Array<ContextItem[]> = [
  [
    {
      id: ListEvent.ContextChangeText,
      text: "Byt namn",
    },
    {
      id: ListEvent.ContextDelete,
      text: "Ta bort",
    }
  ]
]

const InvestigationList = (props: Props) => {
  const [items, setItems] = useState<Array<ListItem>>(props.investigations);
  const [menuVisible, setMenuVisible] = useState<boolean>(true);

  // TODO: just for demonstration
  const [id, setID] = useState<number>(items.length);

  const eventHandler = (response: ListEventResponse) => {
    switch(response.event) {
      case ListEvent.ClickOnRoot:
        log.debug("Goto investigation:", response.id);
        break;

      case ListEvent.ChangeTextOfRoot:
        log.debug("Change name of id", response.id, "to:", response.value);

        // TODO: just for demonstration, otherwise cleanup !
        {
          let newItems = [...items];
          let index = newItems.findIndex((elem) => elem.id == response.id);
          newItems[index].text = response.value!;
          setItems(newItems);
        }
        break;

      case ListEvent.ContextDelete: {
          log.debug("Delete investigation:", response.id);

          // TODO: just for demonstration
          {
            let newItems = [...items];
            let index = newItems.findIndex((elem) => elem.id == id);
            newItems.splice(index, 1);
            setItems(newItems);
          }
          break;
        }

      default:
        log.error("Bad event: ", response.event)
        break;
    }
  }

  const addNewItem = () => {
    log.debug("New item...")
    setItems(prev => [...prev, {
      id: id,
      text: "Ny utredning " + id,
      children: [],
      subroots: [],
    }]);
    setID(prev => prev + 1);
  }

  const toggleVisibility = () => {
    setMenuVisible(!menuVisible);
  }

  return (
    <>
      <span
        className="listMenuHeader"
        onClick={toggleVisibility}
      >
        Utredningar
      </span>
      { menuVisible &&
        <ListMenu
          key={items.length}
          items={items}
          contextMenus={CONTEXT_MENUS}
          eventHandler={eventHandler}
        />
      }
      <button className="listAddButton" onClick={addNewItem}>Ny utredning</button>
    </>
  )
}

export default InvestigationList;
