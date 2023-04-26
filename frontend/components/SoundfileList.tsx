import { ReactElement, useState } from "react";
import ListMenu, { ListEvent, ListEventResponse } from "@/components/ListMenu/ListMenu";
import { ListItemType } from "@/components/ListMenu/ListItemType";
import ContextItem from "@/components/ContextMenu/ContextItem";
import useComponentVisible from "@/hooks/useComponentVisible";
import Popup from "@/components/Popup";
import { LOG as log } from "@/pages/_app";
import Soundclip from "@/models/General/Soundclip";
import AppState from "@/state/AppState";

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
        log.debug("Add to dossier popup on:", response.id);
        setIsPopupVisible(true);
        setCurrentPopup(0);
        if (response.parentID != undefined) {
          setCurrentParentID(response.parentID);
        }
        break;

      case ListEvent.ContextSetStatus: {
        log.debug("Set status of:", response.id);
        setIsPopupVisible(true);
        setCurrentPopup(1);
        if (response.parentID != undefined) {
          setCurrentParentID(response.parentID);
        }
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
        log.debug("Add clip", response.id, "to", currentParentID);
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
        {props.header}
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
              reference={popupContainerReference}
              closeHandler={closePopup}
            />
            :
            <Popup
              component={dossierPopupComponent}
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
