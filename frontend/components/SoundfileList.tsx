import { ReactElement, useState } from "react";
import ListMenu, { ListEvent, ListEventResponse } from "@/components/ListMenu/ListMenu";
import { ItemStatus, ListItemType } from "@/components/ListMenu/ListItemType";
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
  setAppState: (appState: AppState) => void,
  forceUpdate: Function
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
  const [currentParentId, setCurrentParentID] = useState<number>(-1);
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
        if (currentParentId != -1) {
          let clip = props.appState.selectedSoundChain?.soundClips.find(clip => clip.id == currentParentId);
          let newDossiers = DossiersHelper.addFileToDossier(props.appState.dossiers, response.id, clip!);
          let newState = props.appState;
          newState.dossiers = newDossiers;
          props.setAppState(newState);
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
      id: ItemStatus.Untreated,
      text: "Ej behandlad",
      collapsable: false
    },
    {
      id: ItemStatus.Treated,
      text: "Behandlad",
      collapsable: false
    },
    {
      id: ItemStatus.Rejected,
      text: "Avvisad",
      collapsable: false
    },
  ]

  const statusPopupHandler = (response: ListEventResponse) => {
    switch (response.event) {
      case ListEvent.ClickOnSubroot:
      case ListEvent.ClickOnRoot:
        APIService.setStatusOnSoundfile(props.appState.selectedInvestigation?.id!,
                                        props.appState.selectedSoundChain?.id!,
                                        currentParentId,
                                        response.id);
        let newState = props.appState;
        let index = newState.selectedSoundChain?.soundClips.findIndex((clip) => clip.id === currentParentId);
        if (index != undefined && newState.selectedSoundChain != undefined) {
          newState.selectedSoundChain.soundClips[index].state = "" + response.id;
        }
        props.setAppState(newState);
        props.forceUpdate();
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
