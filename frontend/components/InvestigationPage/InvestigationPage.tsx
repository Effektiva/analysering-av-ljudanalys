import Investigation from "@/models/General/Investigation";
import SoundClassFilterInput from "../SoundClassFilterInput";
import SoundchainList from "../LeftMenu/SoundchainList";
import SoundChain from "@/models/General/SoundChain";

type Props = {
  investigation: Investigation,
  soundChains: Array<SoundChain>,
  soundChainSelected: (id: number) => void
}

const STYLE_NAMESPACE = "investigationPage__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
  Header = STYLE_NAMESPACE + "header",
  Column = STYLE_NAMESPACE + "column",
  LeftButtons = STYLE_NAMESPACE + "leftButtons",
  Filtered = STYLE_NAMESPACE + "filtered",
  All = STYLE_NAMESPACE + "all"
}

const InvestigationPage = (props: Props) => {
  return <>
    <div className={Style.Container}>
      {/* Left column */}
      <div className={Style.Column}>
        <div className={Style.LeftButtons}>
          <button>Ladda upp filer</button>
          <button>Analysera ej analyserade kedjor</button>
        </div>
        <SoundClassFilterInput />
      </div>

      {/* Right column */}
      <div className={Style.Column}>
        <div className={Style.Filtered}>
          <SoundchainList soundchains={props.soundChains} soundChainSelected={props.soundChainSelected}/>
        </div>

        <div className={Style.All}>
          <SoundchainList soundchains={props.soundChains} soundChainSelected={props.soundChainSelected}/>
        </div>
      </div>
    </div>
  </>
}

export default InvestigationPage;
