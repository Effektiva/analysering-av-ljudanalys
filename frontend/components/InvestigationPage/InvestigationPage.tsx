import Investigation from "@/models/General/Investigation";
import SoundClassFilterInput from "../SoundClassFilterInput";
import SoundchainList from "../LeftMenu/SoundchainList";

type Props = {
  investigation: Investigation,
  soundChainSelected: (id: number) => void
}

const STYLE_NAMESPACE = "investigationPage__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
  Header = STYLE_NAMESPACE + "header",
  LeftButtons = STYLE_NAMESPACE + "leftButtons",
  Filtered = STYLE_NAMESPACE + "filtered",
  All = STYLE_NAMESPACE + "all"
}

const InvestigationPage = (props: Props) => {
  return <>
    <div className={Style.Container}>
      <div className="row">

        {/* Left column */}
        <div className="col">
          <div className={Style.LeftButtons}>
            <button>Ladda upp filer</button>
            <button>Analysera ej analyserade kedjor</button>
          </div>
          <SoundClassFilterInput />
        </div>

        {/* Right column */}
        <div className="col">
          <div className={Style.Filtered}>
            <SoundchainList soundchains={props.investigation.soundChains} soundChainSelected={props.soundChainSelected}/>
          </div>

          <div className={Style.All}>
            <SoundchainList soundchains={props.investigation.soundChains} soundChainSelected={props.soundChainSelected}/>
          </div>
        </div>
      </div>
    </div>
  </>
}

export default InvestigationPage;
