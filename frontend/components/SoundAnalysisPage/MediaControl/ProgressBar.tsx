import { Event } from "./MediaControl";

type Props = {
  playable: boolean,
  currentTime: number,
  duration: number,
  progressEventHandler: Function
}

const STYLE_NAMESPACE = "progressBar__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
  CurrentTime = STYLE_NAMESPACE + "currentTime",
  Bar = STYLE_NAMESPACE + "bar",
  Progress = STYLE_NAMESPACE + "progress",
  EndTime = STYLE_NAMESPACE + "endTime",
}

/*
 * This is the progress bar that shows where in a sound clip we currently are. It's
 * possible to click the progress bar to seek to that position. It also includes
 * the current/end-time.
 *
 * It expects the following props:
 * currentTime - The current time of the playing clip.
 * endTime - The duration af the playing clip.
 * progressEventHandler - What should be called when the bar is pressed.
 */
const ProgressBar = (props: Props) => {

  /*
   * This is called when the progress bar is clicked. It calculates what percentage
   * of the full width of the bar (from the left) that's before the mouse. It then
   * sets the progress percentage to that.
   */
  const progressBarClick = (event: React.MouseEvent) => {
    let bounds = event.currentTarget.getBoundingClientRect();
    let width = event.currentTarget.clientWidth;
    let relativeClick = event.clientX - bounds.left;
    let procentual = 100*(relativeClick / width);
    props.progressEventHandler(Event.ProgressBar, procentual);
  }

  /*
   * Takes seconds and returns a 00:00 [minutes:seconds] string from it.
   */
  const secondsToTimeString = (seconds: number): string => {
    let minutes = Math.trunc(seconds/60);
    let secondsString = Math.trunc(seconds - minutes*60).toString();
    let minutesString = minutes.toString();

    if (minutesString.length == 1) {
      minutesString = "0" + minutesString;
    }
    if (secondsString.length == 1) {
      secondsString = "0" + secondsString;
    }

    return minutesString + ":" + secondsString;
  }

  return (
      <div className={Style.Container}>
        <div className={Style.CurrentTime}>{secondsToTimeString(props.currentTime)}</div>
        <div
          className={Style.Bar}
          onClick={progressBarClick}
        >
          <div
            className={Style.Progress}
            style={{
              width: 100*(props.currentTime/props.duration) + "%",
              background: props.playable ? "black" : "gray"
            }}
          ></div>
        </div>
        <div className={Style.EndTime}>{secondsToTimeString(props.duration)}</div>
      </div>
  );
}

export default ProgressBar;
