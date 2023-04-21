import Dossier from "@/models/General/Dossier"
import Investigation from "@/models/General/Investigation";
import SoundChain from "@/models/General/SoundChain"
import Soundclip from "@/models/General/Soundclip";

type AppState = {
  dossiers: Array<Dossier>,
  investigations: Array<Investigation>,
  selectedSoundChain: SoundChain | undefined,
  selectedInvestigation: Investigation | undefined,
  currentlyPlayingSoundclip: Soundclip | undefined
}

export default AppState;
