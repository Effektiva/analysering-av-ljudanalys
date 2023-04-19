import InvestigationList from "./InvestigationList";
import DossierList from "./DossierList";
import { DUMMY_DOSSIER_LIST, DUMMY_INVESTIGATION_LIST } from "@/modules/DummyData";
import AppState from "@/state/AppState";

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
  const selectedInvestigationHandler = (id: number) => {
    props.selected(Type.INVESTIGATION, id);
  }

  const selectedDossierHandler = (id: number) => {
    props.selected(Type.DOSSIER, id);
  }

  return (
    <div className="left-menu">
      <InvestigationList
        selected={selectedInvestigationHandler}
        investigations={DUMMY_INVESTIGATION_LIST}
        appState={props.appState}
      />
      <DossierList
        selected={selectedDossierHandler}
        dossiers={DUMMY_DOSSIER_LIST}
      />
    </div>
  )
}

export default LeftMenu;
