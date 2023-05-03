import InvestigationList from "./InvestigationList";
import DossierList from "./DossierList";
import AppState from "@/state/AppState";
import { useEffect, useState } from "react";
import Investigation from "@/models/General/Investigation";
import Dossier from "@/models/General/Dossier";
import {FaCommentDots } from "react-icons/fa";
import { LOG as log } from "@/pages/_app";

type Props = {
  selected: Function,
  appState: AppState,
  forceUpdate: boolean
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
    log.debug("Forced rerender leftmenu");
  }, [props.forceUpdate])

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
    <div className="left-menu">
      <div className="left-menu__top">
        <div className="left-menu__button">
          <p>
            Utredar Assisterar Program
          </p>
          <div className="left-menu__icon">
            <FaCommentDots/>
          </div>
        </div>
      </div>
      <InvestigationList
        key={"invs:" + investigations.join(',')}
        selected={selectedInvestigationHandler}
        investigations={investigations}
        appState={props.appState}
      />
      <DossierList
        key={"dosss:" + dossiers.join(',')}
        selected={selectedDossierHandler}
        dossiers={props.appState.dossiers}
        appState={props.appState}
      />
    </div>
  )
}

export default LeftMenu;
