import InvestigationList from "./InvestigationList";
import SoundchainList from "./SoundchainList";
import DossierList from "./DossierList";
import { DUMMY_DOSSIER_LIST, DUMMY_INVESTIGATION_LIST, DUMMY_SOUNDCHAINS_LIST } from "@/modules/DummyData";

type Props = {
  selected: Function,
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
      />
      <DossierList
        selected={selectedDossierHandler}
        dossiers={DUMMY_DOSSIER_LIST}
      />
    </div>
  )
}

export default LeftMenu;
