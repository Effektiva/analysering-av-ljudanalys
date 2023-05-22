import InvestigationList from "./InvestigationList";
import DossierList from "./DossierList";
import AppState from "@/state/AppState";
import { useEffect, useState } from "react";
import Investigation from "@/models/General/Investigation";
import Dossier from "@/models/General/Dossier";
import { FaCommentDots } from "react-icons/fa";

type Props = {
  selected: Function,
  appState: AppState,
  setAppState: Function,
  forceUpdate: boolean
}

const STYLE_NAMESPACE = "leftMenu__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
  Header = STYLE_NAMESPACE + "header",
  Top = STYLE_NAMESPACE + "top",
  Button = STYLE_NAMESPACE + "button",
  Icon = STYLE_NAMESPACE + "icon",
}

export enum Type {
  INVESTIGATION,
  SOUNDCHAIN,
  SOUNDFILE,
  DOSSIER
}

const LeftMenu = (props: Props) => {
  const [investigations, setInvestigations] = useState<Investigation[]>(props.appState.investigations);
  const [dossiers, setDossiers] = useState<Dossier[]>(props.appState.dossiers);

  useEffect(() => {
    setInvestigations(props.appState.investigations);
  }, [props.appState.investigations]);

  useEffect(() => {
    setDossiers(props.appState.dossiers);
  }, [props.appState.dossiers]);

  const selectedInvestigationHandler = (id: number) => {
    props.selected(Type.INVESTIGATION, id);
  }

  const selectedDossierHandler = (id: number) => {
    props.selected(Type.DOSSIER, id);
  }

  return (
    <div className={Style.Container}>
      <div className={Style.Top}>
        <div className={Style.Button}>
          <p>
            Utredningsassistansprogram
          </p>
          <div className={Style.Icon}>
            <FaCommentDots/>
          </div>
        </div>
      </div>
      <InvestigationList
        key={"invs:" + investigations.join(',')}
        selected={selectedInvestigationHandler}
        investigations={investigations}
        appState={props.appState}
        setAppState={props.setAppState}
      />
      <DossierList
        key={"dosss:" + dossiers.join(',')}
        selected={selectedDossierHandler}
        dossiers={props.appState.dossiers}
        appState={props.appState}
        setAppState={props.setAppState}
      />
    </div>
  )
}

export default LeftMenu;
