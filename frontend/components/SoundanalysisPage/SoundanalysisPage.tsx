import SoundfileList from "@/components/SoundfileList";
import SoundClassFilterInput from "@/components/SoundClassFilterInput";
import Graph from "./Graph";
import MetadataView from "./MetaDataView";
import { useState } from "react";
import MediaControl from "./MediaControl/MediaControl";
import SoundChain from "@/models/General/SoundChain";
import Note from "@/models/SoundAnalysis/Note";
import Notes from "./Notes/Notes";
import AppState from "@/state/AppState";

type Props = {
  soundchain: SoundChain,
  appState: AppState,
  updateAppState: (appState: AppState) => void
}

const STYLE_NAMESPACE = "soundAnalysisPage__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
  Header = STYLE_NAMESPACE + "header",
  Filtered = STYLE_NAMESPACE + "filtered",
  All = STYLE_NAMESPACE + "all",
  Zoom = STYLE_NAMESPACE + "zoom",
  Buttons = STYLE_NAMESPACE + "buttons",
  AutoVolume = STYLE_NAMESPACE + "autoVolume",
  SetStatus = STYLE_NAMESPACE + "setStatus",
}

/*
 * The component that contains the whole SoundanalysisPage.
 *
 * @param props - The soundchain that this page should display.
 */
const SoundAnalysisPage = (props: Props) => {
  const [playing, setPlaying] = useState(false);
  const [volumePercentage, setVolumePercentage] = useState(1);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [currentSoundClip, setCurrentSoundClip] = useState<undefined | HTMLAudioElement>(undefined);
  const [currentClipID, setCurrentClipID] = useState<number>(-1);

  const getSoundClipURL = (id: number) => {
    return "clips/" + props.soundchain.id + "/SoundClips/" + id + ".mp3";
  }

  /*
   * If a clip is selected in any of the soundfile lists this function is ran
   * and given the ID of that soundfile.
   */
  const clipSelected = (id: number) => {
    if (id != currentClipID) {
      currentSoundClip?.pause();

      const newClip = new Audio(getSoundClipURL(id));
      setCurrentSoundClip(newClip);
      setCurrentClipID(id);
    }
  }

  const soundchainCommentsUpdated = (newNotes: Array<Note>) => {
    props.soundchain.comments = newNotes;
    console.log("Updated comments!");
    // TODO: Send to backend
  }

  return (
    <div className={Style.Container}>
      <div className="row">

        {/* Left column */}
        <div className="col">
          <div className={Style.Header}>
            Ljudkedja: {props.soundchain.name}

            <select className={Style.SetStatus}>
              <option>Ej behandlad</option>
              <option>Behandlad</option>
              <option>Avvisad</option>
            </select>
          </div>

          <SoundClassFilterInput />

          <div className={Style.Filtered}>
            <SoundfileList
              clipSelected={clipSelected}
              header="Filtrerade ljudklipp"
              soundfiles={props.soundchain.soundClips} // TODO: This should be filtered...
              appState={props.appState}
              updateAppState={props.updateAppState}
            />
          </div>

          <div className={Style.All}>
            <SoundfileList
              clipSelected={clipSelected}
              header="Samtliga ljudklipp"
              soundfiles={props.soundchain.soundClips}
              appState={props.appState}
              updateAppState={props.updateAppState}
            />
          </div>
        </div>

        {/* Right column */}
        <div className="col">
          <Graph />
          <MediaControl
            key={currentClipID}
            currentClipID={currentClipID}
            playing={playing}
            setPlaying={setPlaying}
            audioElement={currentSoundClip}
            progressPercentage={progressPercentage}
            setProgressPercentage={setProgressPercentage}
            volumePercentage={volumePercentage}
            setVolumePercentage={setVolumePercentage}
          />
          <div className={Style.Buttons}>
            <div className={Style.Zoom}>
              Zoom
              <button>Hela kedjan</button>
              <button>Nuvarande klipp</button>
            </div>
            <button className={Style.AutoVolume}>
              Automagisk ljudsänkning
            </button>
          </div>
          <MetadataView metaData={props.soundchain.soundClips[0].metadata}/>
          <Notes soundchain={props.soundchain} soundchainCommentsUpdated={soundchainCommentsUpdated} />
        </div>
      </div>
    </div>
  );
}

export default SoundAnalysisPage;
