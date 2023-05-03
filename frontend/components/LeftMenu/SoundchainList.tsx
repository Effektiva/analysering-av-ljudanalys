import ListMenu, { ListEvent, ListEventResponse } from "@/components/ListMenu/ListMenu";
import ContextItem from "@/components/ContextMenu/ContextItem";
import { LOG as log } from "@/pages/_app";
import SoundChain from "@/models/General/SoundChain";
import APIService from "@/models/APIService";
import AppState from "@/state/AppState";

type Props = {
  appState: AppState,
  setAppState: Function,
  soundChainSelected: (id: number) => void,
  forceUpdate: Function
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
  const eventHandler = (response: ListEventResponse) => {
    switch(response.event) {
      case ListEvent.ClickOnRoot:
        log.debug("Goto soundchain:", response.id);
        props.soundChainSelected(response.id);
        break;
      case ListEvent.ContextDelete:
        {
          APIService.deleteSoundchain(props.appState.selectedInvestigation?.id!, response.id);
          let newState = props.appState;
          newState.soundChains = [...props.appState.soundChains];
          let index = newState.soundChains.findIndex((elem: SoundChain) => elem.id == response.id);
          newState.soundChains.splice(index, 1);
          props.setAppState(newState);
          props.forceUpdate();
        }
        break;
      default:
        log.error("Bad event: ", response.event)
        break;
    }
  }

  return (
    <>
      <div
        className="listMenuHeader"
      >
        <div className="listItemButton">
          Samtliga ljudkedjor
        </div>
      </div>
        <ListMenu
          items={props.appState.soundChains.map(soundchain => soundchain.asListItem())}
          contextMenus={CONTEXT_MENUS}
          eventHandler={eventHandler}
        />
    </>
  )
}

export default SoundchainList;
