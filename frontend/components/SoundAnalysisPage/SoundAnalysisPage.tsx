import SoundfileList from "@/components/SoundfileList";
import { Soundchain } from "@/components/MainView";
import SoundClassFilterInput from "@/components/SoundClassFilterInput";
import { DUMMY_SOUNDFILES_FILTERED_LIST, DUMMY_SOUNDFILES_LIST } from "@/modules/DummyData";
import Graph from "./Graph";
import ProgressBar from "./ProgressBar";
import MetaData from "./MetaData";
import Notes from "./Notes/Notes";

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

const SoundanalysisPage = (props: Props) => {
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
              header="Filtrerade ljudklipp"
              soundfiles={DUMMY_SOUNDFILES_FILTERED_LIST}
            />
          </div>

          <div className={Style.All}>
            <SoundfileList
              header="Samtliga ljudklipp"
              soundfiles={DUMMY_SOUNDFILES_LIST}
            />
          </div>
        </div>

        {/* Right column */}
        <div className="col">
          <Graph />
          <ProgressBar />
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
          <MetaData />
          <Notes />
        </div>
      </div>
    </div>
  );
}

export default SoundanalysisPage;
