import { useEffect, useState } from "react";
import {
  FaBackward as BackwardIcon,
  FaPlay as PlayIcon,
  FaPause as PauseIcon,
  FaForward as ForwardIcon } from "react-icons/fa";
import { LOG as log } from "@/pages/_app";
import ProgressBar from "./ProgressBar";
import VolumeBar from "./VolumeBar";
import Soundclip from "@/models/General/Soundclip";
import SoundChain from "@/models/General/SoundChain";

type Props = {
  playing: boolean,
  setPlaying: Function,
  volumePercentage: number,
  setVolumePercentage: Function,
  muted: boolean,
  setMuted: Function,
  soundchain: SoundChain | undefined,
  soundclip: Soundclip | undefined,
  setSoundclip: Function,
  clipZoom: boolean,
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
 * soundchain - The current soundchain that's chosen.
 * soundclip - The current soundclip that's chosen.
 * setSoundclip - The function to be called when setting a new soundclip.
 * zoomed - Whether we're zoomed into a clip or viewing the whole chain.
 */
const MediaControl = (props: Props) => {
  const [playable, setPlayable] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [seek, setSeek] = useState<number>(0);

  // Run when audioElement changes (e.g. new clip is chosen/seeked to).
  useEffect(() => {
    if (props.soundclip != undefined && props.soundclip.audioElement != undefined) {
      log.debug("soundclip change:", props.soundclip.id);

      updateTimes();
      props.soundclip.audioElement.volume = props.volumePercentage;
      props.soundclip.audioElement.muted = props.muted;

      // Runs when the audio has finished loading.
      props.soundclip.audioElement.oncanplay = () => {
        setPlayable(true);
        if (props.soundclip != undefined && props.soundclip.audioElement != undefined) {
          if (props.playing) props.soundclip.audioElement.play();

          // When we want to seek somewhere which requires us to change
          // the currently playing clip, then seek is set to where in the
          // newly chosen clip we want to start at.
          if (seek && props.soundclip.audioElement != undefined) {
            props.soundclip.audioElement.currentTime = seek;
            setSeek(0);
          }

          // <obj>.oncanplay is ran whenever the clip is playable, not only when it
          // "initialised", which is what we wish to use it for.
          props.soundclip.audioElement.oncanplay = () => {};
        } else {
          log.error("Soundclip or audioElement is undefined.");
        }
      };

      // Update the progress counters when ...audioElement.currentTime changes.
      props.soundclip.audioElement.ontimeupdate = updateTimes;

      // Play the next clip in the soundchain when this one finishes.
      props.soundclip.audioElement.onended = () => {
        log.debug("Soundclip ended...");

        if (props.soundclip) {
          let newClip = props.soundchain?.getNextClipAndSetAudioElement(props.soundclip);
          if (newClip) {
            log.debug("New clip exists, playing:", newClip.id);
            props.setSoundclip(newClip);
          } else {
            log.debug("No next clip, stop playing.");
            props.setPlaying(false);
          }
        }
      };
    }
  }, [props.soundclip]); // ignore warning, we only want to run when soundclip changes

  // Run when the zoom-level changes.
  useEffect(() => {
    log.debug("zoomed:", props.clipZoom);

    if (props.soundclip != undefined && props.soundclip.audioElement != undefined) {
      updateTimes();

      // I think this function is saved "statically" when we set it above once
      // a new soundclip is chosen. Which means `props.zoomed` doesn't update
      // inside of it when it changes. So we have to re-set it here to get the
      // correct `props.zoomed` value inside of updateTimes().
      props.soundclip.audioElement.ontimeupdate = updateTimes;
    }
  }, [props.clipZoom]); // ignore warning, we only want to run when zoom is changed

  /*
   * Set duration/currentTime depending on the zoom-level.
   */
  const updateTimes = () => {
    if (props.soundclip?.audioElement == undefined) {
      log.error("props.soundclip?.audioElement is undefined");
      return;
    }

    if (props.clipZoom) {
      setCurrentTime(props.soundclip.audioElement.currentTime);
      setDuration(props.soundclip.duration);
    } else {
      if (props.soundchain != undefined) {
        let current = props.soundchain.getSecondsToStartOfClip(props.soundclip) + props.soundclip.audioElement.currentTime;
        setCurrentTime(current);
        setDuration(props.soundchain.duration);
      } else {
        log.error("props.soundchain is undefined");
      }
    }
  }

  /*
   * Called on all button presses related to progress changes.
   */
  const buttonHandler = (event: Event) => {
    if (!playable) {
      log.error("Soundclip not playable yet.");
      return;
    }

    switch(event) {
      case Event.Backward:
        progressEventHandler(Event.Backward, 0);
        break;
      case Event.TogglePlay:
        if (props.soundclip?.audioElement == undefined) {
          log.error("props.soundclip?.audioElement is undefined");
          return;
        }

        props.setPlaying(!props.playing);

        if (props.soundclip.audioElement.paused) {
          props.soundclip.audioElement?.play();
        } else {
          props.soundclip.audioElement?.pause();
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
    if (props.soundclip?.audioElement != undefined) {
      props.soundclip.audioElement.volume = perc;
      props.setVolumePercentage(perc);
    } else {
      log.error("audioElement is undefined");
    }
  }

  const muteHandler = (val: boolean) => {
    if (props.soundclip?.audioElement) {
      props.soundclip.audioElement.muted = val;
    }
    props.setMuted(val);
  }

  /*
   * Called either from ProgressBar.tsx whenever the bar is pressed, or
   * from this file when forward/backwards buttons are pressed.
   */
  const progressEventHandler = (event: Event, perc: number) => {
    if (props.soundclip?.audioElement != undefined && props.soundclip?.audioElement.duration != undefined) {
      let seekTo = 0;

      if (props.clipZoom) {
        switch(event) {
          case Event.Forward:
            if (props.soundchain != undefined && props.soundclip != undefined) {
              seekTo = props.soundchain?.getSecondsToStartOfClip(props.soundclip) + currentTime + 30;
            }
            break;
          case Event.Backward:
            if (props.soundchain != undefined && props.soundclip != undefined) {
              seekTo = props.soundchain?.getSecondsToStartOfClip(props.soundclip) + currentTime - 30;
            }
            break;
          case Event.ProgressBar:
            seekTo = duration * (perc/100);
            props.soundclip?.audioElement.fastSeek(seekTo);
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
            if (props.soundchain) {
              seekTo = (perc/100) * props.soundchain?.duration;
            } else {
              log.error("props.soundchain is undefined.");
            }
            break;
          default:
            log.error("Unhandled event:", event);
            break;
        }
      }

      if (props.soundchain) {
        // In seconds, where are we ending up because of the seek?
        let str = new Date(seekTo*1000).toISOString().slice(11,19);
        log.debug("chain seek:", str);

        // Do we need to switch clips?
        let newClipID = undefined;
        let totalDuration = 0;
        props.soundchain?.soundClips?.some((elem, _) => {
          // If where we want to end up is less than the total
          // duration of the clips we've looped over, then we know
          // the current clip is the clip we want to switch to.
          totalDuration += elem.duration;
          if (seekTo < totalDuration) {
            newClipID = elem.id;
            return true;
          }
        });
        let switchClips = newClipID != props.soundclip.id;

        if (newClipID != undefined) {
          // If the new clip isn't the first clip in the soundchain we need to
          // remove the time upto this clip.
          if (newClipID != 0) {
            let clip = props.soundchain.getSoundclip(newClipID);
            if (clip) {
              seekTo = seekTo - props.soundchain.getSecondsToStartOfClip(clip);
            }
          }

          str = new Date(seekTo*1000).toISOString().slice(11,19);
          log.debug("clip seek:", str);

          if (switchClips) {
            props.soundclip.audioElement.pause();
            props.setSoundclip(props.soundchain.getSoundclipAndSetAudioElement(newClipID));
            setSeek(seekTo); // where we want to start on the new clip when it initialises
            setPlayable(false);
          } else {
            props.soundclip?.audioElement.fastSeek(seekTo);
            updateTimes();
          }
        } else {
          log.error("newClipID is undefined");
        }
      } else {
        log.error("Soundchain is undefined.");
      }
    } else {
      log.error("Audio element/duration is undefined.");
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
          key={props.soundclip?.id}
          playable={playable}
          volumePercentage={props.volumePercentage}
          setVolumePercentage={volumeEventHandler}
          muted={props.muted}
          setMuted={muteHandler}
        />
      </div>

      <ProgressBar
        key={props.soundclip?.id}
        playable={playable}
        currentTime={currentTime}
        duration={duration}
        progressEventHandler={progressEventHandler}
      />
    </div>
  );
}

export default MediaControl;
