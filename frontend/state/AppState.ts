import Dossier from "@/models/General/Dossier"
import Investigation from "@/models/General/Investigation";
import SoundChain from "@/models/General/SoundChain"

type AppState = {
  dossierState: Array<Dossier>,
  selectedSoundChain: SoundChain | undefined,
  selectedInvestigation: Investigation | undefined
}

export default AppState;
