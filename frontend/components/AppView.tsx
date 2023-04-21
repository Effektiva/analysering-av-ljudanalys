import { Async } from "react-async";
import AppState from "@/state/AppState";
import APIService from "@/models/APIService";
import MainView from "./MainView";

const loadInvestigation = async (): Promise<AppState> => {
  const dossiers = await APIService.getDossiers();
  const investigations = await APIService.getInvestigations();
  return {
    dossiers: dossiers,
    investigations: investigations,
    selectedSoundChain: undefined,
    selectedInvestigation: investigations[0],
    currentlyPlayingSoundclip: undefined
  }
};

/**
 * Used to load everything async from the start
 */
const AppView = () => {
  return (
    <Async promiseFn={loadInvestigation}>
      {({ data, error, isLoading,  }) => {
      if (isLoading) return "Loading blyat (your mom) data...";
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
