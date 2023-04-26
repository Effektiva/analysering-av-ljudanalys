import { useState } from "react";
import ListMenu, { ItemType, ListEvent, ListEventResponse } from "@/components/ListMenu/ListMenu";
import ContextItem from "@/components/ContextMenu/ContextItem";
import { LOG as log } from "@/pages/_app";
import Dossier from "@/models/General/Dossier";
import APIService from "@/models/APIService";

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

  const eventHandler = async (response: ListEventResponse) => {
    switch(response.event) {
      case ListEvent.ClickOnRoot:
      case ListEvent.ClickOnSubroot:
        // Ignore
        break;

      case ListEvent.ClickOnChild:
        props.selected(response.id);
        break;

      case ListEvent.ChangeTextOfRoot:
        if (response.value != undefined) {
          APIService.changeDossierName(response.id, response.value);
          let newDossiers = [...dossiers];
          let index = dossiers.findIndex((elem) => elem.id == response.id);
          newDossiers[index].name = response.value!;
          setDossiers(newDossiers);
        }
        break;

      case ListEvent.ChangeTextOfSubroot:
        if (response.value != undefined) {
          APIService.changeDossierName(response.id, response.value);
          let newDossiers = [...dossiers];
          let parentIndex = dossiers.findIndex((elem) => elem.id == response.parentID);
          let parent = newDossiers[parentIndex];
          let childIndex = parent.subdossiers!.findIndex((elem) => elem.id == response.id);
          parent.subdossiers![childIndex].name = response.value!;
          setDossiers(newDossiers);
        }
        break;

      case ListEvent.ContextCreateFolder:
        let index = dossiers.findIndex((elem) => elem.id === response.id);
        let name = "Ny subdossier " + dossiers[index].subdossiers.length;
        let id = await APIService.createSubDossier(response.id, name);
        if (id != -1) {
          log.debug(response.id);
          let newDossiers = [...dossiers];
          newDossiers[index].subdossiers.push(new Dossier(id, name, [], []));
          setDossiers(newDossiers);
        }
        break;

      case ListEvent.ContextExport:
        log.debug("Export", "(" + response.itemType + "):", response.id);
        break;

      case ListEvent.ContextDelete:
        switch(response.itemType) {
          case ItemType.Root:
            {
              let newDossiers = [...dossiers];
              let index = dossiers.findIndex((dos) => dos.id == response.id);
              newDossiers.splice(index, 1);
              setDossiers(newDossiers);
            }
            APIService.deleteDossier(response.id);
            break;
          case ItemType.Subroot:
            {
              let newDossiers = [...dossiers];
              let parentIndex = dossiers.findIndex((dos) => dos.id == response.parentID);
              let parent = newDossiers[parentIndex];
              let childIndex = parent.subdossiers!.findIndex((elem) => elem.id == response.id);
              parent.subdossiers.splice(childIndex, 1);
              setDossiers(newDossiers);
            }
            APIService.deleteDossier(response.id);
            break;
          case ItemType.Child:
            log.debug("Del child");
            break;

        }
        break;

      default:
        log.error("Bad event: ", response.event)
        break;
    }
  }

  const addNewItem = async () => {
    let id = await APIService.createDossier("Ny dossier " + dossiers.length);
    if (id != -1) {
      setDossiers(prev => [...prev, new Dossier(id, "Ny dossier " + dossiers.length)]);
    }
  }

  const toggleVisibility = () => {
    setMenuVisible(!menuVisible);
  }

  return (
    <>
      <div className="dossier_listmenu">
        <span
          className={"listMenuHeader" + ( !menuVisible ? " collapsed" : "")}
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
      </div>
    </>
  )
}

export default DossierList;
