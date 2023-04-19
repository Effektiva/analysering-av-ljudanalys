import { useEffect, useState } from "react";
import {
  FaBackward as BackwardIcon,
  FaPlay as PlayIcon,
  FaPause as PauseIcon,
  FaForward as ForwardIcon } from "react-icons/fa";
import { LOG as log } from "@/pages/_app";
import ProgressBar from "./ProgressBar";
import VolumeBar from "./VolumeBar";

type Props = {
  currentClipID: number,
  playing: boolean,
  setPlaying: Function,
  audioElement: HTMLAudioElement | undefined,
  volumePercentage: number,
  setVolumePercentage: Function,
  progressPercentage: number,
  setProgressPercentage: Function,
  muted: boolean,
  setMuted: Function,
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
 * currentClipID - The ID of the current clip being played.
 * playing - If the current clip is playing or not.
 * setPlaying - The function to be called when setting playing.
 * audioElement - The Audio object of the currently selected sound clip.
 * volumePercentage - The current volume percentage.
 * setVolumePercentage - The function to be called when setting volume percentage.
 * progressPercentage - The current progress percentage of the clip.
 * setProgressPercentage - The function to be called when setting progress percentage.
 */
const MediaControl = (props: Props) => {
  const [playable, setPlayable] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  // Only run when audioElement changes (e.g. new clip was chosen).
  useEffect(() => {
    if (props.audioElement != undefined) {
      props.setProgressPercentage(0);
      props.audioElement.volume = props.volumePercentage;
      props.audioElement.muted = props.muted;

      // Wait until the audio element has loaded.
      props.audioElement.oncanplay = audioElementLoaded;

      // Update the visuals when audioElement.currentTime changes.
      props.audioElement.ontimeupdate = onTimeUpdate;
    }
  }, [props.audioElement]); // ignore warning, we only want to run when audioElement changes

  /*
   * Set visual things when a new audio element has finished loadind and decide on playback.
   */
  const audioElementLoaded = () => {
    if (props.audioElement != undefined) {
      setCurrentTime(props.audioElement.currentTime);
      setDuration(props.audioElement.duration);
      setPlayable(true);
      if (props.playing) {
        props.audioElement.play();
      }
    }
  }

  /*
   * When the audio elements time updates, then also update the visuals for the media
   * controller.
   */
  const onTimeUpdate = () => {
    if (props.audioElement) {
      let progressPercentage = 100*props.audioElement?.currentTime/props.audioElement?.duration;
      props.setProgressPercentage(Math.trunc(progressPercentage));

      setCurrentTime(props.audioElement?.currentTime);
      setDuration(props.audioElement?.duration);

      if (props.audioElement.ended) {
        props.setPlaying(false);
      }
    }
  }

  /*
   * Called on all button presses related to progress changes.
   */
  const buttonHandler = (event: Event) => {
    if (!playable) {
      log.error("audio element not playable");
      return;
    }

    switch(event) {
      case Event.Backward:
        progressEventHandler(Event.Backward, 0);
        break;
      case Event.TogglePlay:
        if (props.audioElement == undefined) {
          log.error("audioElement is undefined");
          return;
        }

        props.setPlaying(!props.playing);

        if (props.audioElement.paused) {
          props.audioElement?.play();
        } else {
          props.audioElement?.pause();
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
    if (props.audioElement != undefined) {
      props.audioElement.volume = perc;
      props.setVolumePercentage(perc);
    } else {
      log.error("audioElement is undefined");
    }
  }

  const muteHandler = (val: boolean) => {
    if (props.audioElement) {
      props.audioElement.muted = val;
    }
    props.setMuted(val);
  }

  /*
   * Called either from ProgressBar.tsx whenever the bar is pressed, or
   * from this file when play/pause or forward/backwards buttons are pressed.
   */
  const progressEventHandler = (event: Event, perc: number) => {
    if (props.audioElement != undefined && props.audioElement.duration != undefined) {
      let newPercent = props.progressPercentage;

      switch(event) {
        case Event.Forward:
          props.audioElement.fastSeek(props.audioElement.currentTime + 30);
          newPercent = (props.progressPercentage + 30)/props.audioElement.duration;
          break;
        case Event.Backward:
          props.audioElement.fastSeek(props.audioElement.currentTime - 30);
          newPercent = (props.progressPercentage - 30)/props.audioElement.duration;
          break;
        case Event.ProgressBar:
          let seek = duration * (perc/100);
          props.audioElement.fastSeek(seek);
          newPercent = perc;
          break;
        default:
          log.error("Unhandled event:", event);
          break;
      }

      props.setProgressPercentage(newPercent);
    } else {
      log.error("audio element/duration is undefined");
    }
  }

  return (
    <div className={Style.Container}>

      {/* Media buttons */}
      <div className={Style.buttonsContainer}>
        <div
          style={{color: playable ? "black" : "gray"}}
          className={Style.BackwardsButton}
          onClick={() => buttonHandler(Event.Backward)}
        ><BackwardIcon /></div>
        <div
          style={{color: playable ? "black" : "gray"}}
          className={Style.StopPlayButton}
          onClick={() => buttonHandler(Event.TogglePlay)}
        >{props.playing ? <PauseIcon /> : <PlayIcon />}</div>
        <div
          style={{color: playable ? "black" : "gray"}}
          className={Style.ForwardButton}
          onClick={() => buttonHandler(Event.Forward)}
        ><ForwardIcon /></div>

        <VolumeBar
          key={props.currentClipID}
          playable={playable}
          volumePercentage={props.volumePercentage}
          setVolumePercentage={volumeEventHandler}
          muted={props.muted}
          setMuted={muteHandler}
        />
      </div>

      <ProgressBar
        key={props.currentClipID}
        playable={playable}
        currentTime={currentTime}
        duration={duration}
        progressEventHandler={progressEventHandler}
      />
    </div>
  );
}

export default MediaControl;
