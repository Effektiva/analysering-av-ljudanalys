import { useState } from "react";
import ListMenu, { ListEvent, ListEventResponse } from "@/components/ListMenu/ListMenu";
import ContextItem from "@/components/ContextMenu/ContextItem";
import { LOG as log } from "@/pages/_app";
import Dossier from "@/models/General/Dossier";

type Props = {
  selected: Function,
  dossiers: Array<Dossier>,
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
      id: ListEvent.ContextDelete,
      text: "Ta bort från dossier",
    },
  ]
];

const DossierList = (props: Props) => {
  const [dossiers, setDossiers] = useState<Array<Dossier>>(props.dossiers);
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
          let newItems = [...dossiers];
          let index = newItems.findIndex((elem) => elem.id == response.id);
          newItems[index].name = response.value!;
          setDossiers(newItems);
        }
        break;

      case ListEvent.ChangeTextOfSubroot:
        log.debug("Change name of ", response.parentID + "." + response.id, "to:", response.value)

        // TODO: just for demonstration, otherwise cleanup !
        {
          let newItems = [...dossiers];
          let parentIndex = newItems.findIndex((elem) => elem.id == response.parentID);
          let parent = newItems[parentIndex];
          let childIndex = parent.subdossiers!.findIndex((elem) => elem.id == response.id);
          parent.subdossiers![childIndex].name = response.value!;
          setDossiers(newItems);
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
    setDossiers(prev => [...prev, new Dossier(id, "Dossier " + id)]);
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
          key={dossiers.length}
          items={dossiers.map((dossier) => dossier.asListItem())}
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
