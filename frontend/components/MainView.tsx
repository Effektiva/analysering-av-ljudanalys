import { DUMMY_INVESTIGATION_LIST, DUMMY_INVESTIGATION, DUMMY_DOSSIER_LIST, DUMMY_SOUNDCHAINS_LIST, DUMMY_SOUNDCHAINS_LIST2 } from "@/modules/DummyData";
import { useEffect, useState } from "react";
import LeftMenu, { Type } from "./LeftMenu/LeftMenu";
import SoundanalysisPage from "./SoundAnalysisPage/SoundAnalysisPage";
import InvestigationPage from "./InvestigationPage/InvestigationPage";
import AppState from "@/state/AppState";
import SoundChain from "@/models/General/SoundChain";
import Investigation from "@/models/General/Investigation";
import { LOG as log } from "@/pages/_app";

/**
 * The MainView is the main component switching beteen pages (Investigations, Dossiers, etc)
 * and does this through passing a handler funktion through props to the LeftMenu component.
 * Whenever a user left clickes on a investigation, dossier or something else relevant in the
 * left menu, this handler funktion is called by the child component LeftMenu, passing an id
 * and type of the list item and the page is updated accordingly.
 */
const MainView = () => {
  const [appState, setAppState] = useState<AppState>({
    dossierState: DUMMY_DOSSIER_LIST,
    selectedSoundChain: undefined,
    selectedInvestigation: DUMMY_INVESTIGATION,
    currentlyPlayingSoundclip: undefined
  });

  const soundChainSelectedHandler = (id: number) => {
    selectedHandler(Type.SOUNDCHAIN, id);
  };

  const [page, setPage] = useState(
    <InvestigationPage
      investigation={appState.selectedInvestigation!}
      soundChainSelected={soundChainSelectedHandler}
    />
  ); // TODO: Remove force

  // Attempt to obtain the right path to dossier sub data.
  const getSearchPath = (id: number) => {
    let num = id;
    let ids: number[] = [];
    while (num) {
      const remainder = num % 10;
      num -= remainder;
      num /= 10;
      ids = [remainder, ...ids];         // Appending to the back of the array.
    }
    return ids;
  }

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
        const investigation: Investigation = filterById(DUMMY_INVESTIGATION_LIST, id);
        var newState = appState;
        newState.selectedInvestigation = investigation;
        newState.selectedSoundChain = undefined;
        newState.currentlyPlayingSoundclip = undefined;
        setAppState(newState);
        setPage(<InvestigationPage key={appState.selectedInvestigation?.id} investigation={appState.selectedInvestigation!} soundChainSelected={soundChainSelectedHandler}/>);
        break;
      case Type.SOUNDCHAIN: // Todo: need to figure out a good way to structure dossier data so that its easy to extract.
        log.debug("Selected soundChain with id: " + id);
        const soundChain: SoundChain = filterById([...DUMMY_SOUNDCHAINS_LIST, ...DUMMY_SOUNDCHAINS_LIST2], id);
        var newState = appState;
        newState.selectedSoundChain = soundChain;
        newState.currentlyPlayingSoundclip = undefined;
        setAppState(newState);
        setPage(<SoundanalysisPage key={appState.selectedSoundChain?.id} soundchain={appState.selectedSoundChain!} appState={appState} updateAppState={setAppState} />);
        break;
      default:
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
