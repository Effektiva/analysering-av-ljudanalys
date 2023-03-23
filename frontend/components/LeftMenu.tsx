import InvestigationList from "@/components/InvestigationList";
import SoundchainList from "@/components/SoundchainList";
import SoundfileList from "@/components/SoundfileList";
import DossierList from "@/components/DossierList";
import { DUMMY_DOSSIER_LIST, DUMMY_INVESTIGATION_LIST, DUMMY_SOUNDCHAINS_LIST, DUMMY_SOUNDFILES_LIST } from "@/modules/DummyData";

const LeftMenu = () => {
  return (
    <div className="row">
      <InvestigationList
        investigations={DUMMY_INVESTIGATION_LIST}
      />
      <SoundchainList
        soundchains={DUMMY_SOUNDCHAINS_LIST}
      />
      <SoundfileList
        soundfiles={DUMMY_SOUNDFILES_LIST}
      />
      <DossierList
        dossiers={DUMMY_DOSSIER_LIST}
      />
    </div>
  )
}

export default LeftMenu;
