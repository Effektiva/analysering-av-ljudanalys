import { useState } from "react";
import ListMenu, { ListEvent, ListEventResponse } from "@/components/ListMenu/ListMenu";
import ListItem from "@/components/ListMenu/ListItem";
import ContextItem from "@/components/ContextMenu/ContextItem";
import { LOG as log } from "@/pages/_app";

type Props = {
  selected: Function,
  dossiers: Array<ListItem>,
}

const CONTEXT_MENUS: Array<ContextItem[]> = [
  [
    {
      id: ListEvent.ContextChangeText,
      text: "Byt namn",
    },
    {
      id: ListEvent.ContextCreateFolder,
      text: "Skapa underkatalog",
    },
    {
      id: ListEvent.ContextExport,
      text: "Exportera",
    },
    {
      id: ListEvent.ContextDelete,
      text: "Ta bort",
    }
  ],
  [
    {
      id: ListEvent.ContextChangeText,
      text: "Byt namn",
    },
    {
      id: ListEvent.ContextDelete,
      text: "Ta bort",
    }
  ],
  [
    {
      id: ListEvent.ContextDelete,
      text: "Ta bort från dossier",
    },
  ]
];

const DossierList = (props: Props) => {
  const [items, setItems] = useState<Array<ListItem>>(props.dossiers);
  const [menuVisible, setMenuVisible] = useState<boolean>(true);

  // TODO: just for demonstration
  const [id, setID] = useState(4);

  const eventHandler = (response: ListEventResponse) => {
    switch(response.event) {
      case ListEvent.ClickOnChild:
        log.debug("Goto soundfile:", response.id);
        props.selected(response.id);
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

      case ListEvent.ChangeTextOfSubroot:
        log.debug("Change name of ", response.parentID + "." + response.id, "to:", response.value)

        // TODO: just for demonstration, otherwise cleanup !
        {
          let newItems = [...items];
          let parentIndex = newItems.findIndex((elem) => elem.id == response.parentID);
          let parent = newItems[parentIndex];
          let childIndex = parent.subroots!.findIndex((elem) => elem.id == response.id);
          parent.subroots![childIndex].text = response.value!;
          setItems(newItems);
        }
        break;

      case ListEvent.ContextCreateFolder:
        log.debug("Create folder", "(" + response.nodeType + "):", response.id);
        break;

      case ListEvent.ContextExport:
        log.debug("Export", "(" + response.nodeType + "):", response.id);
        break;

      case ListEvent.ContextDelete:
        log.debug("Delete", "(" + response.nodeType + "):", response.id);
        break;

      case ListEvent.ClickOnRoot:
      case ListEvent.ClickOnSubroot:
        log.debug("Ignore click...");
        break;

      default:
        log.error("Bad event: ", response.event)
        break;
    }
  }

  const addNewItem = () => {
    log.debug("New item...")
    setItems(prev => [...prev, {
      id: id,
      text: "Dossier " + id,
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
        Dossier
      </span>
      { menuVisible &&
        <ListMenu
          key={items.length}
          items={items}
          contextMenus={CONTEXT_MENUS}
          eventHandler={eventHandler}
          toggleableRoots={true}
        />
      }
      <button className="listAddButton" onClick={addNewItem}>Ny dossier</button>
    </>
  )
}

export default DossierList;
