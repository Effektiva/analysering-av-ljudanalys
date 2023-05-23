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
  Bar = STYLE_NAMESPACE + "bar",
  Progress = STYLE_NAMESPACE + "progress",
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

  return (
      <div className={Style.Container}>
        <div
          className={Style.Bar}
          onClick={progressBarClick}
          disabled={!props.playable}
        >
          <div
            className={Style.Progress}
            style={{
              width: 100*(props.currentTime/props.duration) + "%",
            }}
          ></div>
        </div>
      </div>
  );
}

export default ProgressBar;
