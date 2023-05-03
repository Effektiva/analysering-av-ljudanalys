import { useEffect, useState } from "react";
import ListMenu, { ItemType, ListEvent, ListEventResponse } from "@/components/ListMenu/ListMenu";
import ContextItem from "@/components/ContextMenu/ContextItem";
import { LOG as log } from "@/pages/_app";
import Dossier from "@/models/General/Dossier";
import APIService from "@/models/APIService";
import AppState from "@/state/AppState";
import DossiersHelper from "@/models/DossiersHelper";

type Props = {
  selected: Function,
  dossiers: Array<Dossier>,
  appState: AppState,
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
  const [forceUpdate, setForceUpdate] = useState<boolean>(false);

  useEffect(() => {
    setDossiers(props.dossiers);
    setForceUpdate(!forceUpdate);
  }, [props.dossiers]);

  useEffect(() => {
    setDossiers(props.appState.dossiers);
    setForceUpdate(!forceUpdate);
  }, [props.appState.dossiers]);

  // TODO: Possible performance increaser is to use `response.parentID` when handling subroots
  // events. Currently we loop through everything in DossiersHelper instead.
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
      case ListEvent.ChangeTextOfSubroot:
        setDossiers(DossiersHelper.changeText(dossiers, response.id, response.value));
        break;
      case ListEvent.ContextCreateFolder:
        setDossiers(await DossiersHelper.createSubdossier(dossiers, response.id));
        break;
      case ListEvent.ContextExport:
        log.debug("Export", "(" + response.itemType + "):", response.id);
        break;
      case ListEvent.ContextDelete:
        switch(response.itemType) {
          case ItemType.Root:
          case ItemType.Subroot:
            setDossiers(DossiersHelper.removeDossier(dossiers, response.id)!);
            break;
          case ItemType.Child:
            setDossiers(DossiersHelper.removeSoundfile(dossiers, response.parentID!, response.id));
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
        <div
          className={"listMenuHeader listItemCollapsable" + ( !menuVisible ? " collapsed" : "")}
        >
          <div className="listItemButton"
            onClick={toggleVisibility}
          >
            Dossier
          </div>
        </div>
        <div>
          <ListMenu
            key={dossiers.length}
            items={dossiers.map((dossier) => dossier.asListItem())}
            contextMenus={CONTEXT_MENUS}
            eventHandler={eventHandler}
            toggleableRoots={true}
            selectedId={props.appState.selectedSoundclip?.id}
            forceUpdate={forceUpdate}
          />
          <button className="listAddButton" onClick={addNewItem}>Ny dossier</button>
        </div>
      </div>
    </>
  )
}

export default DossierList;
