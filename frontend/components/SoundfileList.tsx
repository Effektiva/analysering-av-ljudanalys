import { ReactElement, useState } from "react";
import ListMenu, { ListEvent, ListEventResponse } from "@/components/ListMenu/ListMenu";
import { ListItem } from "@/components/ListMenu/ListItem";
import ContextItem from "@/components/ContextMenu/ContextItem";
import useComponentVisible from "@/hooks/useComponentVisible";
import { DUMMY_DOSSIER_LIST_NOCHILD } from "@/modules/DummyData";
import Popup from "@/components/Popup";
import { LOG as log } from "@/pages/_app";

type Props = {
  header: string,
  soundfiles: Array<ListItem>,
  clipSelected: Function,
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
  const [items] = useState<Array<ListItem>>(props.soundfiles);
  const [currentParentID, setCurrentParentID] = useState<number>(-1);
  const [currentPopup, setCurrentPopup] = useState<number>(-1);

  const { ref: popupContainerReference,
          isComponentVisible: isPopupVisible,
          setIsComponentVisible: setIsPopupVisible } = useComponentVisible(false);

  const eventHandler = (response: ListEventResponse) => {
    switch(response.event) {
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
    switch(response.event) {
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
                                                key={DUMMY_DOSSIER_LIST_NOCHILD.length}
                                                items={DUMMY_DOSSIER_LIST_NOCHILD}
                                                eventHandler={dossierPopupHandler}
                                              />;

  /*
   * ============================================
   * Popoup for pressing status in context menu
   * ============================================
   */
  const statusPopupContents: ListItem[] = [
    {
      id: 0,
      text: "Ej behandlad",
    },
    {
      id: 1,
      text: "Behandlad",
    },
    {
      id: 2,
      text: "Avvisad",
    },
  ]

  const statusPopupHandler = (response: ListEventResponse) => {
    switch(response.event) {
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
        items={items}
        contextMenus={CONTEXT_MENUS}
        eventHandler={eventHandler}
      />
      { isPopupVisible &&
      <>
        { currentPopup ?
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