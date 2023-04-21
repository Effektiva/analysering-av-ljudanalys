import { Async } from "react-async";
import AppState from "@/state/AppState";
import APIService from "@/models/APIService";
import MainView from "./MainView";

const loadInvestigationsAndDossiers = async (): Promise<AppState> => {
  const dossiers = await APIService.getDossiers();
  const investigations = await APIService.getInvestigations();
  return {
    dossiers: dossiers,
    investigations: investigations,
    soundChains: [],
    selectedSoundChain: undefined,
    selectedInvestigation: undefined,
    currentlyPlayingSoundclip: undefined,
  }
};

/**
 * Used to load everything async from the start
 */
const AppView = () => {
  return (
    <Async promiseFn={loadInvestigationsAndDossiers}>
      {({ data, error, isLoading,  }) => {
      if (isLoading) return "Loading blyat data...";
      if (error) return `Something went wong man: ${error.message}`;
      if (data) {
        return (
          <MainView appState={data}/>
        );
      }
      return null;
    }}
    </Async>
  );
}

export default AppView;
