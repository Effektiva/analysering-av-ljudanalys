import { useState } from "react";
import ListMenu, { ListEvent, ListEventResponse } from "@/components/ListMenu/ListMenu";
import ContextItem from "@/components/ContextMenu/ContextItem";
import { LOG as log } from "@/pages/_app";
import Investigation from "@/models/General/Investigation";
import AppState from "@/state/AppState";

type Props = {
  selected: Function,
  investigations: Array<Investigation>,
  appState: AppState
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
  const [items, setItems] = useState<Array<Investigation>>(props.investigations);
  const [menuVisible, setMenuVisible] = useState<boolean>(true);

  // TODO: just for demonstration
  const [id, setID] = useState<number>(items.length);

  const eventHandler = (response: ListEventResponse) => {
    switch(response.event) {
      case ListEvent.ClickOnRoot:
        log.debug("Goto investigation:", response.id);
        props.selected(response.id);
        break;

      case ListEvent.ChangeTextOfRoot:
        log.debug("Change name of id", response.id, "to:", response.value);

        // TODO: just for demonstration, otherwise cleanup !
        {
          let newItems = [...items];
          let index = newItems.findIndex((elem) => elem.id == response.id);
          newItems[index].name = response.value!;
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
    setItems(prev => [...prev, new Investigation(id, "Ny utredning " + id)]);
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
          items={items.map(investigation => investigation.asListItem())}
          contextMenus={CONTEXT_MENUS}
          eventHandler={eventHandler}
          selectedId={props.appState.selectedInvestigation?.id}
        />
      }
      <button className="listAddButton" onClick={addNewItem}>Ny utredning</button>
    </>
  )
}

export default InvestigationList;
