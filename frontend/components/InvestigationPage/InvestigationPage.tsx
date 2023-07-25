import SoundClassFilterInput from "../SoundClassFilterInput";
import SoundchainList from "../LeftMenu/SoundchainList";
import AppState from "@/state/AppState";
import { useEffect, useState, useRef } from "react";
import FileUploader from "./FileUploader";
import { LOG as log } from "@/pages/_app";
import SoundChain from "@/models/General/SoundChain";
import APIService from "@/models/APIService";

type Props = {
  appState: AppState,
  setAppState: Function,
  soundChainSelected: (id: number) => void
}

enum AnalysisStatus{
  None,
  Running,
  Done
}

const STYLE_NAMESPACE = "investigationPage__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
  Header = STYLE_NAMESPACE + "header",
  Column = STYLE_NAMESPACE + "column",
  LeftButtons = STYLE_NAMESPACE + "leftButtons",
  Filtered = STYLE_NAMESPACE + "filtered",
  All = STYLE_NAMESPACE + "all"
}

const InvestigationPage = (props: Props) => {
  const [_, setForceUpdateLists] = useState<boolean>(false);
  const [filters, setFilters] = useState<any[]>([]);
  const [filteredChains, setFilteredChains] = useState<SoundChain[]>(props.appState.soundChains);

  /*
   * When the chosen filters are updated, then we'll have to update
   * what chains we'll show in the filtered list. Only chains that have
   * all (or a subset) of the filters are shown.
   */
  useEffect(() => {
    let newFiltered: any[] = [];
    props.appState.soundChains.forEach((chain: SoundChain) => {
      let include = true;

      filters.forEach((filter) => {
        if (chain.soundClasses.find((aClass) => filter.name == aClass) == undefined) {
          include = false;
        }
      });

      if (include) newFiltered.push(chain);
    });
    setFilteredChains(newFiltered);
    setForceUpdateLists(prev => !prev);
  }, [filters]);

  const updateLists = () => {
    setFilteredChains(props.appState.soundChains);
    setForceUpdateLists(prev => !prev);
  };

  const analyseFiles = () => {
    APIService.analyzeInvestigationSoundChains(props.appState.selectedInvestigation?.id!);
  };

  return <>
    <div className={Style.Container}>
      {/* Left column */}
      <div className={Style.Column}>
        <div
          className={Style.LeftButtons}
          onClick={analyseFiles}
        ><button>Analysera filer</button></div>
        <SoundClassFilterInput
          filters={filters}
          setFilters={setFilters}
        />
        <FileUploader
          appState={props.appState}
          setAppState={props.setAppState}
          forceUpdate={updateLists}
        />
      </div>

      {/* Right column */}
      <div className={Style.Column}>
        <div className={Style.Filtered}>
          <SoundchainList
            title={"Filtrerade ljudkedjor"}
            appState={props.appState}
            setAppState={props.setAppState}
            soundchains={filteredChains}
            soundChainSelected={props.soundChainSelected}
            forceUpdate={updateLists}
          />
        </div>

        <div className={Style.All}>
          <SoundchainList
            title={"Samtliga ljudkedjor"}
            appState={props.appState}
            setAppState={props.setAppState}
            soundchains={props.appState.soundChains}
            soundChainSelected={props.soundChainSelected}
            forceUpdate={updateLists}
          />
        </div>
      </div>
    </div>
  </>
}

export default InvestigationPage;
