const STYLE_NAMESPACE = "progressBar__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
}

const ProgressBar = () => {
  return (
    <div className={Style.Container}>
      ProgressBar
    </div>
  );
}

export default ProgressBar;
