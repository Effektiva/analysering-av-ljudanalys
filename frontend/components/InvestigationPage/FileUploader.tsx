import { ChangeEvent, useState } from "react";
import { LOG as log } from "@/pages/_app";
import APIService from "@/models/APIService";
import AppState from "@/state/AppState";

type Props = {
  appState: AppState,
  setAppState: Function,
  forceUpdate: Function
}

const STYLE_NAMESPACE = "investigationPage__fileUploader";
enum Style {
  Container = STYLE_NAMESPACE + "container",
  Header = STYLE_NAMESPACE + "header",
}

const FileUploader = (props: Props) => {
  const [fileList, setFileList] = useState<FileList | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileList(e.target.files);
  }

  const handleUpload = async () => {
    if (fileList) {
      let success = await APIService.createSoundchain(props.appState.selectedInvestigation?.id!, fileList);
      if (success) {
        let newState = props.appState;
        let chains = await APIService.getSoundChainsForInvestigation(props.appState.selectedInvestigation?.id!);
        newState.soundChains = chains;
        props.setAppState(newState);
        props.forceUpdate();
      }
    } else {
      log.warning("Can't upload when no files are selected.")
    }
  }

  return (
    <div className={Style.Container}>
      <div className={Style.Header}><h5>Skapa ny ljudkedja</h5></div>
      <input type="file" onChange={handleFileChange} multiple />
      <br/><br/>
      <button onClick={handleUpload}>Ladda upp filer</button>
    </div>
  );
}

export default FileUploader;