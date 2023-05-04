import { useEffect, useState } from "react";
import {
  FaBackward as BackwardIcon,
  FaPlay as PlayIcon,
  FaPause as PauseIcon,
  FaForward as ForwardIcon } from "react-icons/fa";
import { LOG as log } from "@/pages/_app";
import ProgressBar from "./ProgressBar";
import VolumeBar from "./VolumeBar";
import AppState from "@/state/AppState";

type Props = {
  playing: boolean,
  setPlaying: Function,
  volumePercentage: number,
  setVolumePercentage: Function,
  muted: boolean,
  setMuted: Function,
  clipZoom: boolean,
  appState: AppState,
  clipSelected: Function,
}

const STYLE_NAMESPACE = "mediaControl__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
  buttonsContainer = STYLE_NAMESPACE + "buttonsContainer",
  BackwardsButton = STYLE_NAMESPACE + "backwardsButton",
  StopPlayButton = STYLE_NAMESPACE + "stopPlayButton",
  ForwardButton = STYLE_NAMESPACE + "forwardButton",
}

export enum Event {
  Backward = 0,
  TogglePlay,
  Forward,
  ProgressBar,
}

/*
 * The MediaControl component displays the media control buttons, as well as the progress
 * bar and the start/end-time of the currently selected sound clip.
 *
 * It expects the following props:
 * playing - If the current clip is playing or not.
 * setPlaying - The function to be called when setting playing.
 * volumePercentage - The current volume percentage.
 * setVolumePercentage - The function to be called when setting volume percentage.
 * muted - If we're muted.
 * setMuted - The function to be called when setting muted.
 * clipZoom - Whether we're zoomed into a clip or viewing the whole chain.
 * appState - The apps state.
 * clipSelected - To be called when we want to switch clips.
 */
const MediaControl = (props: Props) => {
  const [playable, setPlayable] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [seek, setSeek] = useState<number>(0);

  // Run when soundclip changes (e.g. new clip is chosen/seeked to).
  useEffect(() => {
    const soundclip = props.appState?.selectedSoundclip!;
    const soundchain = props.appState?.selectedSoundChain!;
    log.debug("soundclip change:", soundclip.id);

    if (soundclip == undefined) {
      log.warning("soundclip change in MediaControl: soundclip is undefined");
    } else if (soundclip.audioElement == undefined) {
      log.warning("soundclip change in MediaControl: audioElement is undefined");
    } else {
      updateTimes();
      soundclip.audioElement.volume = props.volumePercentage;
      soundclip.audioElement.muted = props.muted;

      // Runs when the audio has finished loading.
      soundclip.audioElement.oncanplay = () => {
        setPlayable(true);
        if (soundclip != undefined && soundclip.audioElement != undefined) {
          if (props.playing) soundclip.audioElement.play();

          // When we want to seek somewhere which requires us to change
          // the currently playing clip, then seek is set to where in the
          // newly chosen clip we want to start at.
          if (seek && soundclip.audioElement != undefined) {
            soundclip.audioElement.currentTime = seek;
            setSeek(0);
          }

          // <obj>.oncanplay is ran whenever the clip is playable, not only when it
          // "initialised", which is what we wish to use it for.
          soundclip.audioElement.oncanplay = () => {};
        } else {
          log.error("Soundclip or audioElement is undefined.");
        }
      };

      // Update the progress counters when ...audioElement.currentTime changes.
      soundclip.audioElement.ontimeupdate = updateTimes;

      // Play the next clip in the soundchain when this one finishes.
      soundclip.audioElement.onended = () => {
        log.debug("Soundclip ended...");

        if (soundclip) {
          let newClip = soundchain.getNextClipAndSetAudioElement(props.appState.selectedInvestigation?.id!,
                                                                 soundclip);
          if (newClip) {
            log.debug("New clip exists, playing:", newClip.id);
            props.clipSelected(newClip.id);
          } else {
            log.debug("No next clip, stop playing.");
            props.setPlaying(false);
          }
        }
      };
    }
  }, [props.appState.selectedSoundclip]); // ignore warning, we only want to run when soundclip changes

  // Run when the zoom-level changes.
  useEffect(() => {
    const soundclip = props.appState.selectedSoundclip;
    log.debug("zoomed:", props.clipZoom);

    if (soundclip != undefined && soundclip.audioElement != undefined) {
      updateTimes();

      // I think this function is saved "statically" when we set it above once
      // a new soundclip is chosen. Which means `props.zoomed` doesn't update
      // inside of it when it changes. So we have to re-set it here to get the
      // correct `props.zoomed` value inside of updateTimes().
      soundclip.audioElement.ontimeupdate = updateTimes;
    }
  }, [props.clipZoom]); // ignore warning, we only want to run when zoom is changed

  /*
   * Set duration/currentTime depending on the zoom-level.
   */
  const updateTimes = () => {
    const soundclip = props.appState.selectedSoundclip!;
    const soundchain = props.appState.selectedSoundChain!;

    if (soundclip == undefined || soundclip.audioElement == undefined) {
      log.warning("Updating times: Soundclip/audioElement is undefined:", soundclip);
    } else if (soundchain == undefined) {
      log.warning("Updating times: Soundchain is undefined", soundchain);
    } else if (props.clipZoom) {
      setCurrentTime(soundclip.audioElement.currentTime);
      setDuration(soundclip.duration);
    } else {
      let current = soundchain.getSecondsToStartOfClip(soundclip) + soundclip.audioElement.currentTime;
      setCurrentTime(current);
      setDuration(soundchain.duration);
    }
  }

  /*
   * Called on all button presses related to progress changes.
   */
  const buttonHandler = (event: Event) => {
    const soundclip = props.appState.selectedSoundclip!;
    if (!playable) {
      log.warning("Soundclip not playable yet.");
      return;
    } else if (soundclip == undefined) {
      log.warning("Soundclip is undefined");
      return;
    } else if (soundclip.audioElement == undefined) {
      log.warning("audioElement is undefined");
      return;
    }

    switch(event) {
      case Event.Backward:
        progressEventHandler(Event.Backward, 0);
        break;
      case Event.TogglePlay:
        props.setPlaying(!props.playing);

        if (soundclip.audioElement.paused) {
          soundclip.audioElement?.play();
        } else {
          soundclip.audioElement?.pause();
        }
        break;
      case Event.Forward:
        progressEventHandler(Event.Forward, 0);
        break;
      default:
        log.error("Event unhandled:", event);
        break;
    }
  }

  /*
   * Called when the volume is changed in the volume bar. It gets what percentage
   * of the volume bar was pressed.
   */
  const volumeEventHandler = (perc: number) => {
    const soundclip = props.appState.selectedSoundclip;
    if (soundclip == undefined || soundclip.audioElement == undefined) {
      log.warning("Soundclip/audioElement is undefined");
    } else {
      soundclip.audioElement.volume = perc;
      props.setVolumePercentage(perc);
    }
  }

  const muteHandler = (val: boolean) => {
    const soundclip = props.appState.selectedSoundclip;
    if (soundclip == undefined || soundclip.audioElement == undefined) {
      log.warning("Soundclip/audioElement is undefined");
    } else {
      soundclip.audioElement.muted = val;
    }
    props.setMuted(val);
  }

  /*
   * Called either from ProgressBar.tsx whenever the bar is pressed, or
   * from this file when forward/backwards buttons are pressed.
   */
  const progressEventHandler = (event: Event, perc: number) => {
    const soundclip = props.appState.selectedSoundclip;
    const soundchain = props.appState.selectedSoundChain;
    if (soundclip == undefined) {
      log.warning("Soundclip is undefined");
      return;
    } else if (soundclip.audioElement == undefined) {
      log.warning("audioElement is undefined");
      return;
    } else if (soundchain == undefined) {
      log.warning("Soundchain is undefined");
      return;
    }

    let seekTo = 0;
    if (props.clipZoom) {
      switch(event) {
        case Event.Forward:
          seekTo = soundchain.getSecondsToStartOfClip(soundclip) + currentTime + 30;
          break;
        case Event.Backward:
          seekTo = soundchain.getSecondsToStartOfClip(soundclip) + currentTime - 30;
          break;
        case Event.ProgressBar:
          seekTo = duration * (perc/100);
          soundclip.audioElement.fastSeek(seekTo);
          return;
        default:
          log.error("Unhandled event:", event);
          break;
      }
    } else {
      switch(event) {
        case Event.Forward:
            seekTo = currentTime + 30;
          break;
        case Event.Backward:
            seekTo = currentTime - 30;
          break;
        case Event.ProgressBar:
          seekTo = (perc/100) * soundchain.duration;
          break;
        default:
          log.error("Unhandled event:", event);
          break;
      }
    }

    // In seconds, where are we ending up because of the seek?
    let str = new Date(seekTo*1000).toISOString().slice(11,19);
    log.debug("chain seek:", str);

    // Do we need to switch clips?
    let newClipID = undefined;
    let totalDuration = 0;
    soundchain.soundClips?.some((elem, _) => {
      // If where we want to end up is less than the total
      // duration of the clips we've looped over, then we know
      // the current clip is the clip we want to switch to.
      totalDuration += elem.duration;
      if (seekTo < totalDuration) {
        newClipID = elem.id;
        return true;
      }
    });
    let switchClips = newClipID != soundclip.id;

    if (newClipID != undefined) {
      // If the new clip isn't the first clip in the soundchain we need to
      // remove the time upto this clip.
      if (newClipID != 0) {
        let clip = soundchain.getSoundclip(newClipID);
        if (clip) {
          seekTo = seekTo - soundchain.getSecondsToStartOfClip(clip);
        }
      }

      str = new Date(seekTo*1000).toISOString().slice(11,19);
      log.debug("clip seek:", str);

      if (switchClips) {
        soundclip.audioElement.pause();
        props.clipSelected(newClipID);
        setSeek(seekTo); // where we want to start on the new clip when it initialises
        setPlayable(false);
      } else {
        soundclip.audioElement.fastSeek(seekTo);
        updateTimes();
      }
    } else {
      log.error("newClipID is undefined");
    }
  }

  return (
    <div className={Style.Container}>

      {/* Media buttons */}
      <div className={Style.buttonsContainer}>
        <div
          className={Style.BackwardsButton}
          onClick={() => buttonHandler(Event.Backward)}
          disabled={!playable}
        ><BackwardIcon /></div>
        <div
          className={Style.StopPlayButton}
          onClick={() => buttonHandler(Event.TogglePlay)}
          disabled={!playable}
        >{props.playing ? <PauseIcon /> : <PlayIcon />}</div>
        <div
          className={Style.ForwardButton}
          onClick={() => buttonHandler(Event.Forward)}
          disabled={!playable}
        ><ForwardIcon /></div>

        <VolumeBar
          key={props.appState.selectedSoundclip?.id}
          playable={playable}
          volumePercentage={props.volumePercentage}
          setVolumePercentage={volumeEventHandler}
          muted={props.muted}
          setMuted={muteHandler}
        />
      </div>

      <ProgressBar
        key={props.appState.selectedSoundclip?.id}
        playable={playable}
        currentTime={currentTime}
        duration={duration}
        progressEventHandler={progressEventHandler}
      />
    </div>
  );
}

export default MediaControl;
