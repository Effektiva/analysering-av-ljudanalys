import { useState } from "react";
import ListMenu, { ListEvent, ListEventResponse } from "@/components/ListMenu/ListMenu";
import ContextItem from "@/components/ContextMenu/ContextItem";
import { LOG as log } from "@/pages/_app";
import SoundChain from "@/models/General/SoundChain";
import APIService from "@/models/APIService";

type Props = {
  soundchains: Array<SoundChain>,
  soundChainSelected: (id: number) => void,
  investigationID: number | undefined
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
  const [soundchains, setSoundchains] = useState(props.soundchains);
  const [menuVisible, setMenuVisible] = useState<boolean>(true);

  const eventHandler = (response: ListEventResponse) => {
    switch(response.event) {
      case ListEvent.ClickOnRoot:
        log.debug("Goto soundchain:", response.id);
        props.soundChainSelected(response.id);
        break;

      case ListEvent.ContextDelete: {
        if (props.investigationID) {
          APIService.deleteSoundchain(props.investigationID, response.id);
          let newSoundchains = [...soundchains];
          let index = soundchains.findIndex((elem: SoundChain) => elem.id == response.id);
          newSoundchains.splice(index, 1);
          setSoundchains(soundchains);
        }
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
          key={soundchains.length}
          items={soundchains.map(soundchain => soundchain.asListItem())}
          contextMenus={CONTEXT_MENUS}
          eventHandler={eventHandler}
        />
      }
    </>
  )
}

export default SoundchainList;
