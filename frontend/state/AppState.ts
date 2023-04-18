import Dossier from "@/models/General/Dossier"
import SoundChain from "@/models/General/SoundChain"
import Soundclip from "@/models/General/Soundclip";

type AppState = {
  dossierState: Array<Dossier>,
  selectedSoundChain: SoundChain | undefined,
  selectedSoundclips: Array<Soundclip>
}

export default AppState;
