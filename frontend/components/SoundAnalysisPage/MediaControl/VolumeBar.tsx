import { ReactNode, useState } from "react";
import { FaVolumeMute as IconMute,
         FaVolumeOff as IconOff,
         FaVolumeDown as IconDown,
         FaVolumeUp as IconUp } from "react-icons/fa";
import { LOG as log } from "@/pages/_app";

type Props = {
  playable: boolean,
  volumePercentage: number,
  setVolumePercentage: Function,
  muted: boolean | undefined,
  setMuted: Function,
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

    if (props.muted) {
      props.setMuted(false);
    }

    props.setVolumePercentage(procentual);
  }

  /*
   * We display a different volume icon depending on what percentage
   * the volume is at.
   */
  const getIcon = (): ReactNode => {
    let volume = props.volumePercentage;
    if (props.muted) {
      return <IconMute />;
    } else if ((0.0 < volume) && (volume <= 0.10)) {
      return <IconOff />;
    } else if ((0.10 < volume) && (volume <= 0.50)) {
      return <IconDown />;
    } else if ((0.50 < volume) && (volume <= 1)) {
      return <IconUp />;
    } else {
      return <IconUp />;
    }
  }

  const getBarColor = (): string => {
    if (props.playable) {
      if (props.muted) {
        return "white";
      } else {
        return "black";
      }
    } else {
      return "gray";
    }
  }

  return (
    <>
      <div className={Style.Container}>
        <div
          style={{color: props.playable ? "black" : "gray"}}
          className={Style.Button}
          onClick={() => props.setMuted(!props.muted)}
        >{getIcon()}</div>

        <div
          className={Style.Bar}
          onClick={volumeBarClick}
        >
          <div
            className={Style.BarFill}
            style={{
              width: props.muted ? 0 : MAX_VOLUME_PROGRESS_WIDTH * Number(props.volumePercentage) + "%",
              background: getBarColor()
            }}
          ></div>
        </div>
      </div>
    </>
  );
}

export default VolumeBar;
