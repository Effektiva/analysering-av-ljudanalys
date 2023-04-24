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
import Soundclip from "@/models/General/Soundclip";
import { LOG as log } from "@/pages/_app";

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
  const [muted, setMuted] = useState<boolean>(false);
  const [soundclip, setSoundclip] = useState<Soundclip | undefined>(undefined);
  const [clipZoom, setClipZoom] = useState<boolean>(false);

  /*
   * If a clip is selected in any of the soundfile lists this function is ran
   * and given the ID of that soundfile.
   */
  const clipSelected = (id: number) => {
    log.debug("select clip:", id);

    if (soundclip != undefined && soundclip.id != id) {
      soundclip?.audioElement?.pause();

      var appState = props.appState;
      let soundClip = appState.selectedSoundChain?.soundClips.find(soundClip => soundClip.id == id);
      appState.currentlyPlayingSoundclip = soundClip;
      props.updateAppState(appState);
    }

    setSoundclip(props.soundchain.getSoundclipAndSetAudioElement(id));
  }

  const soundchainCommentsUpdated = (newNotes: Array<Note>) => {
    props.soundchain.comments = newNotes;
    log.debug("Updated comments!");
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
            playing={playing}
            setPlaying={setPlaying}
            volumePercentage={volumePercentage}
            setVolumePercentage={setVolumePercentage}
            muted={muted}
            setMuted={setMuted}
            soundchain={props.appState.selectedSoundChain}
            soundclip={soundclip}
            setSoundclip={setSoundclip}
            clipZoom={clipZoom}
          />
          <div className={Style.Buttons}>
            <div className={Style.Zoom}>
              Zoom
              <button
                onClick={() => { setClipZoom(false) }}
                style={{border: clipZoom ? "0" : "1px solid black"}}
              >Hela kedjan</button>
              <button
                onClick={() => { setClipZoom(true) }}
                style={{border: clipZoom ? "1px solid black" : "0"}}
              >Nuvarande klipp</button>
            </div>
            <button className={Style.AutoVolume}>
              Automagisk ljudsänkning
            </button>
          </div>
          <MetadataView metaData={props.appState.currentlyPlayingSoundclip?.metadata ?? props.appState.selectedSoundChain!.soundClips[0].metadata}/>
          <Notes soundchain={props.appState.selectedSoundChain!} soundchainCommentsUpdated={soundchainCommentsUpdated} />
        </div>
      </div>
    </div>
  );
}

export default SoundAnalysisPage;
