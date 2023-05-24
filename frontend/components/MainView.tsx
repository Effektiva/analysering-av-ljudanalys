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

  // For debugging purposes, to see how often the whole app rerenders.
  useEffect(() => {
    log.debug("MainView rerender");
  }, []);

  const updateApp = (newState: AppState) => {
    log.debug("appState updated");
    setAppState(newState);

    // The LeftMenu contains dossiers which is a nested array. When it updates
    // useEffect doesn't seem to be able to pick it up. It can be updated from
    // both within the list itself, but also from SoundAnalysisPage when we add
    // a soundfile to a dossier. So we need a way to update the LeftMenu when
    // that happens. This is the way.
    setForceUpdateLeftMenu(prev => !prev); // TODO: See issue #104
  }

  const soundChainSelectedHandler = (id: number) => {
    log.debug("Open soundchain:", id);
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
          if (appState.selectedSoundclip?.audioElement != undefined) {
            appState.selectedSoundclip?.audioElement.pause();
          }
          newState.selectedInvestigation = investigation;
          newState.soundChains = soundChains;
          newState.selectedSoundChain = undefined;
          newState.selectedSoundclip = undefined;
          setAppState(newState);
          setPage(
            <InvestigationPage
              key={appState.selectedInvestigation?.id}
              appState={newState}
              setAppState={updateApp}
              soundChainSelected={soundChainSelectedHandler}
            />);
        });
        break;
      case Type.SOUNDCHAIN:
        log.debug("Selected soundChain with id: " + id);
        let investigationId = appState.selectedInvestigation?.id;
        APIService.getFullSoundChain(investigationId!, id).then((chain) => {
          var newState = appState;
          newState.selectedSoundChain = chain;

          newState.selectedSoundclip = chain?.getSoundclipAndSetAudioElement(investigationId!,
            chain.soundClips[0].id!);

          setAppState(newState);
          setPage(
            <SoundAnalysisPage
              key={investigationId}
              soundchain={appState.selectedSoundChain!}
              appState={newState}
              updateAppState={updateApp}
            />);
        })
          .catch((error) => {
            log.warning(error);
          });
        break;
      case Type.DOSSIER:
        log.debug("Selected soundclip:", id);
        APIService.getSoundfileInfo(id).then((info) => {
          var newState = appState;
          APIService.getFullSoundChain(info.investigation, info.soundchain).then((chain) => {
            let investigation = appState.investigations.find(inv => inv.id === info.investigation);
            if (appState.selectedSoundclip?.audioElement != undefined) {
              appState.selectedSoundclip?.audioElement.pause();
            }
            newState.selectedInvestigation = investigation;
            newState.selectedSoundChain = chain;
            let clip = newState.selectedSoundChain?.getSoundclipAndSetAudioElement(investigation?.id!, id);
            newState.selectedSoundclip = clip;
            setAppState(newState);
            setPage(
              <SoundAnalysisPage
                key={newState.selectedSoundChain?.id}
                soundchain={newState.selectedSoundChain!}
                appState={newState}
                updateAppState={updateApp}
              />);
          })
            .catch((error) => {
              log.warning(error);
            });
        })
          .catch((error) => {
            log.warning("Couldn't get soundfile info:", error);
          });
        break;
      default:
        setPage(<FrontPage />);
        break;
    }
  }

  return (
    <div className="mainView">
      <LeftMenu
        forceUpdate={forceUpdateLeftMenu}
        selected={selectedHandler}
        appState={appState}
        setAppState={updateApp}
      />
      {page}
    </div>
  )
}

export default MainView;
