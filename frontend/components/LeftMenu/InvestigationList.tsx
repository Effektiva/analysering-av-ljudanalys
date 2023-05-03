import { useEffect, useState } from "react";
import ListMenu, { ListEvent, ListEventResponse } from "@/components/ListMenu/ListMenu";
import ContextItem from "@/components/ContextMenu/ContextItem";
import { LOG as log } from "@/pages/_app";
import Investigation from "@/models/General/Investigation";
import AppState from "@/state/AppState";
import APIService from "@/models/APIService";

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
  const [investigations, setInvestigations] = useState<Array<Investigation>>(props.investigations);
  const [menuVisible, setMenuVisible] = useState<boolean>(true);

  const eventHandler = (response: ListEventResponse) => {
    switch(response.event) {
      case ListEvent.ClickOnRoot:
        props.selected(response.id);
        break;
      case ListEvent.ChangeTextOfRoot:
        if (response.value != undefined) {
          APIService.changeInvestigationName(response.id, response.value);
          let newInvestigations = [...investigations];
          let index = investigations.findIndex((elem: Investigation) => elem.id == response.id);
          newInvestigations[index].name = response.value;
          setInvestigations(newInvestigations);
        } else {
          log.warning("Couldn't change name of investigation, undefined value from input:", response);
        }
        break;
      case ListEvent.ContextDelete: {
        {
          APIService.deleteInvestigation(response.id);
          let newInvestigations = [...investigations];
          let index = investigations.findIndex((elem: Investigation) => elem.id == response.id);
          newInvestigations.splice(index, 1);
          setInvestigations(newInvestigations);
        }
        break;
      }
      default:
        log.error("Bad event: ", response.event)
        break;
    }
  }

  const addNewItem = async () => {
    let name = "Ny utredning " + investigations.length;
    let id = await APIService.createInvestigation(name);
    if (id != -1) {
      setInvestigations(prev => [...prev, new Investigation(id, name)]);
    }
  }

  const toggleVisibility = () => {
    setMenuVisible(!menuVisible);
  }

  return (
    <>
      <div className="investigation_listmenu">
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
