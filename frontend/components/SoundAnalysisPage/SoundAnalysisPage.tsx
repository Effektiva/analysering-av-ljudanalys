import SoundfileList from "@/components/SoundfileList";
import { Soundchain } from "@/components/MainView";
import SoundClassFilterInput from "@/components/SoundClassFilterInput";
import { DUMMY_SOUNDFILES_FILTERED_LIST, DUMMY_SOUNDFILES_LIST } from "@/modules/DummyData";
import Graph from "./Graph";
import MetadataView from "./MetaDataView";
import Notes from "./Notes/Notes";
import Metadata from "@/models/SoundAnalysis/Metadata";
import Dossier from "@/models/General/Dossier";
import { useState } from "react";
import MediaControl from "./MediaControl/MediaControl";

type Props = {
  soundchain: Soundchain,
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
              soundfiles={DUMMY_SOUNDFILES_FILTERED_LIST}
            />
          </div>

          <div className={Style.All}>
            <SoundfileList
              clipSelected={clipSelected}
              header="Samtliga ljudklipp"
              soundfiles={DUMMY_SOUNDFILES_LIST}
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
          <MetadataView metaData={new Metadata("2020-03-12_0315_0722", [new Dossier(1, "jobany urod"), new Dossier(2, "your mother high")])}/>
          <Notes />
        </div>
      </div>
    </div>
  );
}

export default SoundAnalysisPage;
