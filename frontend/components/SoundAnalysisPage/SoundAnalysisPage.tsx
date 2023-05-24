import SoundfileList from "@/components/SoundfileList";
import SoundClassFilterInput from "../SoundClassFilterInput";
import MetadataView from "./MetaDataView";
import { useEffect, useState } from "react";
import MediaControl from "./MediaControl/MediaControl";
import SoundChain from "@/models/General/SoundChain";
import Note from "@/models/SoundAnalysis/Note";
import Notes from "./Notes/Notes";
import AppState from "@/state/AppState";
import { LOG as log } from "@/pages/_app";
import Soundclip from "@/models/General/Soundclip";
import { ItemStatus } from "../ListMenu/ListItemType";
import APIService from "@/models/APIService";

type Props = {
  soundchain: SoundChain,
  appState: AppState,
  updateAppState: (appState: AppState) => void
}

const STYLE_NAMESPACE = "soundAnalysisPage__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
  Col = STYLE_NAMESPACE + "col",
  Header = STYLE_NAMESPACE + "header",
  SoundchainList = "lists",
  Filtered = STYLE_NAMESPACE + "filtered",
  All = STYLE_NAMESPACE + "all",
  Player = STYLE_NAMESPACE + "player",
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
  const [clipZoom, setClipZoom] = useState<boolean>(false);
  const [_, setForceRerender] = useState<boolean>(false);
  const [filteredFiles, setFilteredFiles] = useState<any[]>([]);
  const [notes, setNotes] = useState(props.appState.selectedSoundChain?.comments);
  const [mediaPlayerTime, setMediaPlayerTime] = useState<number>(0);
  const [filters, setFilters] = useState<any[]>([]);

  useEffect(() => {
    updateCommentsByZoom();
  }, [clipZoom]);

  const updateLists = () => {
    setForceRerender(prev => !prev);
  };

  /*
   * When the chosen filters are updated, then we'll have to update
   * what chains we'll show in the filtered list. Only chains that have
   * all (or a subset) of the filters are shown.
   */
  useEffect(() => {
    let newFiltered: any[] = [];
    props.appState.selectedSoundChain?.soundClips.forEach((clip: Soundclip) => {
      let include = true;
      filters.forEach((filter) => {
        if (clip.soundClasses.find((aClass) => filter.name == aClass) == undefined) {
          include = false;
        }
      });

      if (include) newFiltered.push(clip);
    });
    setFilteredFiles(newFiltered);
    setForceRerender(prev => !prev);
  }, [filters]);

  /*
   * If a clip is selected in any of the soundfile lists this function is ran
   * and given the ID of that soundfile.
   */
  const clipSelected = (newClipId: number) => {
    const currentClip = props.appState.selectedSoundclip!;
    if (currentClip.id != newClipId) {
      log.debug("Selected new clip:", newClipId);
      if (playing) { currentClip.audioElement?.pause(); }
      var newState = props.appState;
      let investigationId = newState.selectedInvestigation!.id;
      let newClip = newState.selectedSoundChain?.getSoundclipAndSetAudioElement(investigationId!, newClipId);
      newState.selectedSoundclip = newClip;
      props.updateAppState(newState);
      updateCommentsByZoom();
      setForceRerender(prev => !prev);
    } else {
      log.debug("Already playing clip:", newClipId);
    }
  }

  const updateNotes = (newNotes: Array<Note>) => {
    log.debug("Updated comments!");
    let newState = props.appState;
    newState.selectedSoundChain!.comments = newNotes;
    props.updateAppState(newState);
    updateCommentsByZoom();
  }

  const updateCommentsByZoom = () => {
    if (clipZoom) {
      setNotes(props.appState.selectedSoundChain!.getCommentsForClip(props.appState.selectedSoundclip?.id!));
    } else {
      setNotes(props.appState.selectedSoundChain?.comments);
    }
  }

  const soundchainStateChange = (event: any) => {
    APIService.setSoundchainState(props.appState.selectedInvestigation?.id!,
      props.soundchain.id!,
      event.target.value);
  }

  return (
    <div className={Style.Container}>

      {/* Left column */}
      <div className={Style.Col}>
        <div className={Style.Header}>
          <h1> Ljudkedja: {props.soundchain.name} </h1>

          <div>
            <label htmlFor="statusPicker">Markerad som</label>
            <select
              defaultValue={props.soundchain.getCurrentItemStatus()}
              onChange={soundchainStateChange}
              id="statusPicker" className={Style.SetStatus + " form-select"}
            >
              <option value={ItemStatus.AnalysisSucceeded}>Analyserad</option>
              <option value={ItemStatus.Treated}>Behandlad</option>
              <option value={ItemStatus.Rejected}>Avvisad</option>
            </select>
          </div>
        </div>

        <SoundClassFilterInput
          filters={filters}
          setFilters={setFilters}
        />

        <div className={Style.Filtered}>
          <SoundfileList
            clipSelected={clipSelected}
            header="Filtrerade ljudklipp"
            soundfiles={filteredFiles}
            appState={props.appState}
            setAppState={props.updateAppState}
            forceUpdate={updateLists}
          />
        </div>

        <div className={Style.All}>
          <SoundfileList
            clipSelected={clipSelected}
            header="Samtliga ljudklipp"
            soundfiles={props.soundchain.soundClips}
            appState={props.appState}
            setAppState={props.updateAppState}
            forceUpdate={updateLists}
          />
        </div>
      </div>

      {/* Right column */}
      <div className={Style.Col}>
        <div className={Style.Player}>
          <MediaControl
            playing={playing}
            setPlaying={setPlaying}
            volumePercentage={volumePercentage}
            setVolumePercentage={setVolumePercentage}
            muted={muted}
            setMuted={setMuted}
            appState={props.appState}
            clipSelected={clipSelected}
            clipZoom={clipZoom}
            currentTime={mediaPlayerTime}
            setCurrentTime={setMediaPlayerTime}
            filters={filters}
          />
        </div>
        <div className={Style.Buttons}>
          <div className={Style.Zoom}>
            Zoom
            <button
              onClick={() => { setClipZoom(false) }}
              style={{ border: clipZoom ? "0" : "1px solid black" }}
            >Hela kedjan</button>
            <button
              onClick={() => { setClipZoom(true) }}
              style={{ border: clipZoom ? "1px solid black" : "0" }}
            >Nuvarande klipp</button>
          </div>
          <button className={Style.AutoVolume}>
            Automatisk ljudsänkning
          </button>
        </div>
        <MetadataView
          metaData={props.appState.selectedSoundclip?.metadata ??
            props.appState.selectedSoundChain!.soundClips[0].metadata}
        />
        <Notes
          clipZoom={clipZoom}
          appState={props.appState}
          notes={notes ? notes : []}
          setNotes={updateNotes}
        />
      </div>
    </div>
  );
}

export default SoundAnalysisPage;
