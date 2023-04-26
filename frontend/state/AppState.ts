import Dossier from "@/models/General/Dossier"
import Investigation from "@/models/General/Investigation";
import SoundChain from "@/models/General/SoundChain"
import Soundclip from "@/models/General/Soundclip";

type AppState = {
  dossiers: Array<Dossier>,
  investigations: Array<Investigation>,
  soundChains: Array<SoundChain>,
  selectedSoundChain: SoundChain | undefined,
  selectedInvestigation: Investigation | undefined,
  selectedSoundclip: Soundclip | undefined
}

export default AppState;
