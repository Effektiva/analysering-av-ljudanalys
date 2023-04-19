import { useState } from "react";
import { FaVolumeMute as IconMute,
         FaVolumeOff as IconOff,
         FaVolumeDown as IconDown,
         FaVolumeUp as IconUp } from "react-icons/fa";
import { LOG as log } from "@/pages/_app";

type Props = {
  volumePercentage: number,
  setVolumePercentage: Function,
  playable: boolean
  audioElement: HTMLAudioElement | undefined,
}

const STYLE_NAMESPACE = "volumeBar__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
  Bar = STYLE_NAMESPACE + "bar",
  BarFill = STYLE_NAMESPACE + "barFill",
  Button = STYLE_NAMESPACE + "button",
}

const MAX_VOLUME_PROGRESS_WIDTH = 100;

/*
 * This is the component that shows the volume bar by the media control buttons.
 *
 * @param props - The current volume percentage to use, a function we can use to set
 * the volume percentage (owned by parent) and a `playable` boolean that tells us if
 * the media is ready to be played.
 */
const VolumeBar = (props: Props) => {
  const [muted, setMuted] = useState(false);
  const [volumeBeforeMute, setVolumeBeforeMute] = useState(0.0);

  /*
   * When the volume bar is pressed we calculate what percentage of the width
   * of the bar we pressed. We then set that percentage to the volume percentage.
   */
  const volumeBarClick = (event: React.MouseEvent) => {
    let barBounds = event.currentTarget.getBoundingClientRect();
    let width = event.currentTarget.clientWidth;
    let relativeClick = event.clientX - barBounds.left;
    let procentual = relativeClick / width;

    if (procentual > 1) {
      procentual = 1;
    } else if (procentual < 0) {
      procentual = 0;
    }

    if (props.audioElement?.muted) {
      props.audioElement.muted = false;
      setMuted(false);
    }

    props.setVolumePercentage(procentual);
  }

  const toggleMute = () => {
    if (!muted) {
      setVolumeBeforeMute(props.volumePercentage);
      props.setVolumePercentage(0);
    } else {
      props.setVolumePercentage(volumeBeforeMute);
    }

    log.debug(muted, volumeBeforeMute);
    setMuted(!muted);
  }

  /*
   * We display a different volume icon depending on what percentage
   * the volume is at.
   */
  const getIcon = () => {
    let volume = props.volumePercentage;
    if(volume == 0.0) {
      return <IconMute />;
    } else if ((0.0 < volume) && (volume <= 0.10)) {
      return <IconOff />;
    } else if ((0.10 < volume) && (volume <= 0.50)) {
      return <IconDown />;
    } else if ((0.50 < volume) && (volume <= 1)) {
      return <IconUp />;
    }
  }

  return (
    <>
      <div className={Style.Container}>
        <div
          style={{color: props.playable ? "black" : "gray"}}
          className={Style.Button}
          onClick={toggleMute}
        >{getIcon()}</div>

        <div
          style={{color: props.playable ? "black" : "gray"}}
          className={Style.Bar}
          onClick={volumeBarClick}
        >
          <div
            className={Style.BarFill}
            style={{
              width: muted ? 0 : MAX_VOLUME_PROGRESS_WIDTH * Number(props.volumePercentage) + "%",
              background: props.playable ? "black" : "gray"
            }}
          ></div>
        </div>
      </div>
    </>
  );
}

export default VolumeBar;
