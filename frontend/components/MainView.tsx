import { useState } from "react";
import LeftMenu, { Type } from "./LeftMenu/LeftMenu";
import SoundanalysisPage from "./SoundAnalysisPage/SoundAnalysisPage";
import InvestigationPage from "./InvestigationPage/InvestigationPage";
import AppState from "@/state/AppState";
import SoundChain from "@/models/General/SoundChain";
import Investigation from "@/models/General/Investigation";
import { LOG as log } from "@/pages/_app";
import APIService from "@/models/APIService";
import FrontPage from "./BasicLayout/FrontPage";

type Props = {
  appState: AppState
}


/**
 * The MainView is the main component switching beteen pages (Investigations, Dossiers, etc)
 * and does this through passing a handler funktion through props to the LeftMenu component.
 * Whenever a user left clickes on a investigation, dossier or something else relevant in the
 * left menu, this handler funktion is called by the child component LeftMenu, passing an id
 * and type of the list item and the page is updated accordingly.
 */
const MainView = (props: Props) => {
  const [appState, setAppState] = useState<AppState>(props.appState);

  const soundChainSelectedHandler = (id: number) => {
    selectedHandler(Type.SOUNDCHAIN, id);
  };

  const [page, setPage] = useState(<FrontPage/>);

  const filterById = (dataList: Array<any>, id: number) => {
    const [data] = dataList.filter((data) => {
      return data.id === id;
    })
    return data;
  }

  const selectedHandler = (type: Type, id: number) => {
    switch (type) {
      case Type.INVESTIGATION:
        log.debug("Selected investigation with id: " + id);
        const investigation: Investigation = filterById(appState.investigations, id);
        APIService.getSoundChainsForInvestigation(id).then((soundChains) => {
          var newState = appState;
          newState.selectedInvestigation = investigation;
          newState.soundChains = soundChains;
          newState.selectedSoundChain = undefined;
          newState.currentlyPlayingSoundclip = undefined;
          setAppState(newState);
          setPage(
            <InvestigationPage
              key={appState.selectedInvestigation?.id}
              investigation={appState.selectedInvestigation!}
              soundChains={appState.soundChains}
              soundChainSelected={soundChainSelectedHandler}
            />);
        });
        break;
      case Type.SOUNDCHAIN: // Todo: need to figure out a good way to structure dossier data so that its easy to extract.
        log.debug("Selected soundChain with id: " + id);
        const soundChain: SoundChain = filterById(appState.soundChains, id);
        var newState = appState;
        newState.selectedSoundChain = soundChain;
        newState.currentlyPlayingSoundclip = undefined;
        setAppState(newState);
        setPage(
          <SoundanalysisPage
            key={appState.selectedSoundChain?.id}
            soundchain={appState.selectedSoundChain!}
            appState={appState}
            updateAppState={setAppState}
          />);
        break;
      default:
        setPage(<FrontPage/>);
        break;
    }
  }

  return (
    <div className="main-view">
      <LeftMenu selected={selectedHandler} appState={appState} />
      {page}
    </div>
  )
}

export default MainView;
