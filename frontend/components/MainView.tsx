import { useEffect, useState } from "react";
import LeftMenu, { Type } from "./LeftMenu/LeftMenu";
import SoundAnalysisPage from "./SoundAnalysisPage/SoundAnalysisPage";
import InvestigationPage from "./InvestigationPage/InvestigationPage";
import AppState from "@/state/AppState";
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
  const [page, setPage] = useState(<FrontPage />);
  const [forceUpdateLeftMenu, setForceUpdateLeftMenu] = useState<boolean>(false);

  const updateApp = (newState: AppState) => {
    setForceUpdateLeftMenu(prev => !prev); // TODO: See issue #104
    setAppState(newState);
  }

  const soundChainSelectedHandler = (id: number) => {
    selectedHandler(Type.SOUNDCHAIN, id);
  };

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
          newState.selectedSoundclip = undefined;
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
      case Type.SOUNDCHAIN:
        log.debug("Selected soundChain with id: " + id);
        if (appState.selectedInvestigation?.id != undefined) {
          APIService.getFullSoundChain(appState.selectedInvestigation.id, id).then((chain) => {
            var newState = appState;
            newState.selectedSoundChain = chain;
            newState.selectedSoundclip = undefined;
            setAppState(newState);
            setPage(
              <SoundAnalysisPage
                key={appState.selectedSoundChain?.id}
                soundchain={appState.selectedSoundChain!}
                appState={appState}
                updateAppState={updateApp}
              />);
          });
        } else {
          log.warning("appState.selectedInvestigation.id is undefined");
        }
        break;
      case Type.DOSSIER:
        log.debug("Selected soundclip:", id);
        APIService.getSoundfileInfo(id).then((info) => {
          var newState = appState;
          APIService.getFullSoundChain(info.investigation, info.soundchain).then((chain) => {
            let investigation = appState.investigations.find(inv => inv.id === info.investigation);
            newState.selectedInvestigation = investigation;
            newState.selectedSoundChain = chain;
            let clip = newState.selectedSoundChain?.getSoundclip(id);
            newState.selectedSoundclip = clip;
            setAppState(newState);
            setPage(
              <SoundAnalysisPage
                key={appState.selectedSoundChain?.id}
                soundchain={appState.selectedSoundChain!}
                appState={appState}
                updateAppState={updateApp}
              />);
          });
        });
        break;
      default:
        setPage(<FrontPage />);
        break;
    }
  }

  return (
    <div className="main-view">
      <LeftMenu
        forceUpdate={forceUpdateLeftMenu}
        selected={selectedHandler}
        appState={appState}
      />
      {page}
    </div>
  )
}

export default MainView;
