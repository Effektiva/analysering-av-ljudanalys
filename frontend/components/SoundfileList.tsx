import { ReactElement, useState } from "react";
import ListMenu, { ListEvent, ListEventResponse } from "@/components/ListMenu/ListMenu";
import { ListItemType } from "@/components/ListMenu/ListItemType";
import ContextItem from "@/components/ContextMenu/ContextItem";
import useComponentVisible from "@/hooks/useComponentVisible";
import Popup from "@/components/Popup";
import { LOG as log } from "@/pages/_app";
import Soundclip from "@/models/General/Soundclip";
import AppState from "@/state/AppState";
import APIService from "@/models/APIService";
import DossiersHelper from "@/models/DossiersHelper";

type Props = {
  header: string,
  soundfiles: Array<Soundclip>,
  clipSelected: Function,
  appState: AppState,
  updateAppState: (appState: AppState) => void
}

const CONTEXT_MENUS: Array<ContextItem[]> = [
  [
    {
      id: ListEvent.ContextAddToDossier,
      text: "Lägg till i dossier",
    },
    {
      id: ListEvent.ContextSetStatus,
      text: "Sätt status",
    }
  ]
]

const SoundfileList = (props: Props) => {
  const [items] = useState<Array<Soundclip>>(props.soundfiles);
  const [currentParentID, setCurrentParentID] = useState<number>(-1);
  const [currentPopup, setCurrentPopup] = useState<number>(-1);

  const { ref: popupContainerReference,
    isComponentVisible: isPopupVisible,
    setIsComponentVisible: setIsPopupVisible } = useComponentVisible(false);

  const eventHandler = (response: ListEventResponse) => {
    switch (response.event) {
      case ListEvent.ClickOnRoot:
        props.clipSelected(response.id);
        break;

      case ListEvent.ContextAddToDossier:
        setIsPopupVisible(true);
        setCurrentPopup(0);
        setCurrentParentID(response.id);
        break;

      case ListEvent.ContextSetStatus: {
        setIsPopupVisible(true);
        setCurrentPopup(1);
        setCurrentParentID(response.id);
        break;
      }

      default:
        log.error("Bad event: ", response.event)
        break;
    }
  }

  const closePopup = () => {
    setIsPopupVisible(false);
    setCurrentPopup(-1);
  }

  /*
   * ============================================
   * Popoup for pressing dossier in context menu
   * ============================================
   */
  const dossierPopupHandler = (response: ListEventResponse) => {
    switch (response.event) {
      case ListEvent.ClickOnSubroot:
      case ListEvent.ClickOnRoot:
        if (currentParentID != -1) {
          let clip = props.appState.selectedSoundChain?.soundClips.find(clip => clip.id == currentParentID);
          let newDossiers = DossiersHelper.addFileToDossier(props.appState.dossiers, response.id, clip!);
          let newState = props.appState;
          newState.dossiers = newDossiers;
          props.updateAppState(newState);
        } else {
          log.warning("No dossier ID set.")
        }
        setIsPopupVisible(false);
        break;
      default:
        log.error("Bad event: ", response.event)
        break;
    }
  }

  const dossierPopupComponent: ReactElement = <ListMenu
    key={props.appState.dossiers.length}
    items={props.appState.dossiers.map(dossier => dossier.topAndSubDossierListItems())}
    eventHandler={dossierPopupHandler}
  />;

  /*
   * ============================================
   * Popoup for pressing status in context menu
   * ============================================
   */
  const statusPopupContents: ListItemType[] = [
    {
      id: 0,
      text: "Ej behandlad",
      collapsable: false
    },
    {
      id: 1,
      text: "Behandlad",
      collapsable: false
    },
    {
      id: 2,
      text: "Avvisad",
      collapsable: false
    },
  ]

  const statusPopupHandler = (response: ListEventResponse) => {
    switch (response.event) {
      case ListEvent.ClickOnSubroot:
      case ListEvent.ClickOnRoot:
        log.debug("Add status", statusPopupContents[response.id].text, "to", currentParentID);
        setIsPopupVisible(false);
        APIService.setStatusOnSoundfile(props.appState.selectedInvestigation?.id!,
                                        props.appState.selectedSoundChain?.id!,
                                        currentParentID, response.id)
        break;
      default:
        log.error("Bad event: ", response.event)
        break;
    }
  }

  const statusPopupComponent: ReactElement = <ListMenu
    key={statusPopupContents.length}
    items={statusPopupContents}
    eventHandler={statusPopupHandler}
  />;


  /*
   * ============================================
   * Main component
   * ============================================
   */
  return (
    <>
      <div
        className="listMenuHeader"
      >
        <div className="listItemButton">
          {props.header}
        </div>
      </div>
      <ListMenu
        key={items.length}
        items={items.map((soundclip) => soundclip.asListItem())}
        contextMenus={CONTEXT_MENUS}
        eventHandler={eventHandler}
        selectedId={props.appState.selectedSoundclip?.id}
      />
      {isPopupVisible &&
        <>
          {currentPopup ?
            <Popup
              component={statusPopupComponent}
              title="Sätt status av ljudklipp till"
              reference={popupContainerReference}
              closeHandler={closePopup}
            />
            :
            <Popup
              component={dossierPopupComponent}
              title="Lägg till ljudklipp i dossier"
              reference={popupContainerReference}
              closeHandler={closePopup}
            />
          }
        </>
      }
    </>
  )
}

export default SoundfileList;
