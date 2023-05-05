import SoundClassFilterInput from "../SoundClassFilterInput";
import SoundchainList from "../LeftMenu/SoundchainList";
import AppState from "@/state/AppState";
import { useState } from "react";
import FileUploader from "./FileUploader";

type Props = {
  appState: AppState,
  setAppState: Function,
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
  const [_, setForceUpdateLists] = useState<boolean>(false);

  const updateLists = () => {
    setForceUpdateLists(prev => !prev);
  };

  return <>
    <div className={Style.Container}>
      {/* Left column */}
      <div className={Style.Column}>
        <div className={Style.LeftButtons}><button>Analysera filer</button></div>
        <SoundClassFilterInput />
        <FileUploader
          appState={props.appState}
          setAppState={props.setAppState}
          forceUpdate={updateLists}
        />
      </div>

      {/* Right column */}
      <div className={Style.Column}>
        <div className={Style.Filtered}>
          <SoundchainList
            appState={props.appState}
            setAppState={props.setAppState}
            soundChainSelected={props.soundChainSelected}
            forceUpdate={updateLists}
          />
        </div>

        <div className={Style.All}>
          <SoundchainList
            appState={props.appState}
            setAppState={props.setAppState}
            soundChainSelected={props.soundChainSelected}
            forceUpdate={updateLists}
          />
        </div>
      </div>
    </div>
  </>
}

export default InvestigationPage;
