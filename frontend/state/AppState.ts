import Dossier from "@/models/General/Dossier"
import SoundChain from "@/models/General/SoundChain"

type AppState = {
  dossierState: Array<Dossier>,
  selectedSoundChain: SoundChain | undefined
}

export default AppState;
