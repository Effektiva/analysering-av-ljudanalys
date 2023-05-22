import { useState } from "react";
import ListMenu, { ListEvent, ListEventResponse } from "@/components/ListMenu/ListMenu";
import ContextItem from "@/components/ContextMenu/ContextItem";
import { LOG as log } from "@/pages/_app";
import Investigation from "@/models/General/Investigation";
import AppState from "@/state/AppState";
import APIService from "@/models/APIService";
import DossiersHelper from "@/models/DossiersHelper";

type Props = {
  selected: Function,
  investigations: Array<Investigation>,
  appState: AppState,
  setAppState: Function
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
  const [investigations, setInvestigations] = useState<Array<Investigation>>(props.investigations);
  const [menuVisible, setMenuVisible] = useState<boolean>(true);

  const eventHandler = async (response: ListEventResponse) => {
    switch(response.event) {
      case ListEvent.ClickOnRoot:
        props.selected(response.id);
        break;
      case ListEvent.ChangeTextOfRoot:
        if (response.value != undefined) {
          changeInvestigationName(response.id, response.value);
        } else {
          log.warning("Couldn't change name of investigation, undefined value from input:", response);
        }
        break;
      case ListEvent.ContextDelete: {
        deleteInvestigation(response.id);
        break;
      }
      default:
        log.error("Bad event: ", response.event)
        break;
    }
  }

  const changeInvestigationName = async (id: number, name: string) => {
    try {
      APIService.changeInvestigationName(id, name);
      let newInvestigations = [...investigations];
      let index = investigations.findIndex((elem: Investigation) => elem.id == id);
      newInvestigations[index].name = name;
      setInvestigations(newInvestigations);
    } catch (error) {
      log.error(error);
    }
  }

  const deleteInvestigation = async (id: number) => {
    let newState = props.appState;
    let newDossiers = newState.dossiers;
    let chains = await APIService.getSoundChainsForInvestigation(id);
    for (let i = 0; i < chains.length; i++) {
      let chain = chains.at(i);
      try {
        let fullChain = await APIService.getFullSoundChain(id, chain?.id!)
        newDossiers = DossiersHelper.removeSoundfiles(newDossiers, fullChain?.soundClips!)
      } catch (error) {
        log.warning(error);
      }
    }
    newState.dossiers = newDossiers;
    props.setAppState(newState);
    let newInvestigations = [...investigations];
    let index = investigations.findIndex((elem: Investigation) => elem.id == id);
    newInvestigations.splice(index, 1);
    APIService.deleteInvestigation(id);
    setInvestigations(newInvestigations);
  }

  const addNewItem = async () => {
    let name = "Ny utredning " + investigations.length;
    let id = await APIService.createInvestigation(name).catch((err) => {
      log.error("Couldn't create investigation: ", err);
      return undefined;
    });
    if (id !== undefined) {
      setInvestigations(prev => [...prev, new Investigation(id, name)]);
    }
  }

  const toggleVisibility = () => {
    setMenuVisible(!menuVisible);
  }

  return (
    <>
      <div className="investigationListMenu">
        <div
          className={"listMenuHeader listItemCollapsable" + ( !menuVisible ? " collapsed" : "")}
        >
          <div className="listItemButton"
            onClick={toggleVisibility}
          >
            Utredningar
          </div>
        </div>
        <div>
          <ListMenu
            key={investigations.length}
            items={investigations.map(investigation => investigation.asListItem())}
            contextMenus={CONTEXT_MENUS}
            eventHandler={eventHandler}
            selectedId={props.appState.selectedInvestigation?.id}
            />
          <button className="listAddButton" onClick={addNewItem}>Ny utredning</button>
        </div>
      </div>
    </>
  )
}

export default InvestigationList;
