const STYLE_NAMESPACE = "graph__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
}

const Graph = () => {
  return (
    <div className={Style.Container}>
      Graf
    </div>
  );
}

export default Graph;
