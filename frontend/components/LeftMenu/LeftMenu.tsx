import InvestigationList from "./InvestigationList";
import DossierList from "./DossierList";
import AppState from "@/state/AppState";
import { useEffect, useState } from "react";
import Investigation from "@/models/General/Investigation";
import Dossier from "@/models/General/Dossier";

type Props = {
  selected: Function,
  appState: AppState
}

export enum Type {
  INVESTIGATION,
  SOUNDCHAIN,
  SOUNDFILE,
  DOSSIER
}

const LeftMenu = (props: Props) => {

  const [investigations, setInvestigations] = useState<Investigation[]>(props.appState.investigations);
  const [dossiers, setDossiers] = useState<Dossier[]>(props.appState.dossiers);

  useEffect(() => {
    setInvestigations(props.appState.investigations);
  }, [props.appState.investigations]);

  useEffect(() => {
    setDossiers(props.appState.dossiers);
  }, [props.appState.dossiers]);

  const selectedInvestigationHandler = (id: number) => {
    props.selected(Type.INVESTIGATION, id);
  }

  const selectedDossierHandler = (id: number) => {
    props.selected(Type.DOSSIER, id);
  }

  return (
    <div className="left-menu">
      <InvestigationList
        key={"invs:" + investigations.join(',')}
        selected={selectedInvestigationHandler}
        investigations={investigations}
        appState={props.appState}
      />
      <DossierList
        key={"dosss:" + dossiers.join(',')}
        selected={selectedDossierHandler}
        dossiers={props.appState.dossiers}
        appState={props.appState}
      />
    </div>
  )
}

export default LeftMenu;
