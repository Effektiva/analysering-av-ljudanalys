import { useState } from "react";
import ListMenu, { ListEvent, ListEventResponse } from "./ListMenu/ListMenu";
import { ListItem } from "@/components/ListMenu/ListItem";
import ContextItem from "@/components/ContextMenu/ContextItem";
import { LOG as log } from "@/pages/_app";

type Props = {
  soundchains: Array<ListItem>,
}

const CONTEXT_MENUS: Array<ContextItem[]> = [
  [
    {
      id: ListEvent.ContextDelete,
      text: "Radera ljudkedja",
    }
  ]
]

const SoundchainList = (props: Props) => {
  const [items] = useState<Array<ListItem>>(props.soundchains);
  const [menuVisible, setMenuVisible] = useState<boolean>(true);

  const eventHandler = (response: ListEventResponse) => {
    switch(response.event) {
      case ListEvent.ClickOnRoot:
        log.debug("Goto soundchain:", response.id);
        break;

      case ListEvent.ContextDelete: {
        log.debug("Remove soundchain:", response.id);
        break;
      }

      default:
        log.error("Bad event: ", response.event)
        break;
    }
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
        Samtliga ljudkedjor
      </span>
      { menuVisible &&
        <ListMenu
          key={items.length}
          items={items}
          contextMenus={CONTEXT_MENUS}
          eventHandler={eventHandler}
        />
      }
    </>
  )
}

export default SoundchainList;
