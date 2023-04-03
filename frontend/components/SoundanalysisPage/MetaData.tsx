const STYLE_NAMESPACE = "metaData__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
}

const MetaData = () => {
  return (
    <div className={Style.Container}>
      Meta data
    </div>
  );
}

export default MetaData;
