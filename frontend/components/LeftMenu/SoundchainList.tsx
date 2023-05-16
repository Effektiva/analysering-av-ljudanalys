import ListMenu, { ListEvent, ListEventResponse } from "@/components/ListMenu/ListMenu";
import ContextItem from "@/components/ContextMenu/ContextItem";
import { LOG as log } from "@/pages/_app";
import SoundChain from "@/models/General/SoundChain";
import APIService from "@/models/APIService";
import AppState from "@/state/AppState";
import DossiersHelper from "@/models/DossiersHelper";

type Props = {
  appState: AppState,
  setAppState: Function,
  title: string,
  soundchains: SoundChain[],
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
  const eventHandler = async (response: ListEventResponse) => {
    switch(response.event) {
      case ListEvent.ClickOnRoot:
        props.soundChainSelected(response.id);
        break;
      case ListEvent.ContextDelete:
        deleteSoundchain(response.id);
        break;
      default:
        log.error("Bad event: ", response.event)
        break;
    }
  }

  const deleteSoundchain = async (id: number) => {
    let newState = props.appState;
    newState.soundChains = [...props.appState.soundChains];
    let index = newState.soundChains.findIndex((elem: SoundChain) => elem.id == id);
    try {
      let chain = await APIService.getFullSoundChain(props.appState.selectedInvestigation?.id!, id);
      newState.dossiers = DossiersHelper.removeSoundfiles(props.appState.dossiers, chain?.soundClips!);
      newState.soundChains.splice(index, 1);
      APIService.deleteSoundchain(props.appState.selectedInvestigation?.id!, id);
      props.setAppState(newState);
      props.forceUpdate();
    } catch (error) {
      log.error(error);
    }
  }

  return (
    <>
      <div
        className="listMenuHeader"
      >
        <div className="listItemButton">
          {props.title}
        </div>
      </div>
        <ListMenu
          items={props.soundchains.map(soundchain => soundchain.asListItem())}
          contextMenus={CONTEXT_MENUS}
          eventHandler={eventHandler}
        />
    </>
  )
}

export default SoundchainList;
