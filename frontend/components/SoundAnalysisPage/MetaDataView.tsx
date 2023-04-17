import { SERVER_PROPS_ID } from "next/dist/shared/lib/constants";
import MetaData from "@/models/SoundAnalysis/MetaData";


type Props = {
  metaData: MetaData;
}

const STYLE_NAMESPACE = "metaData__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
  Header = STYLE_NAMESPACE + "header",
}

const MetaDataView = (props: Props) => {
  return (
    <div className={Style.Container}>
      <div className={Style.Header}>Metadata</div>
        <span> Filnamn: {props.metaData.getName()}</span>
        <span> Datum: {props.metaData.getDate()}</span>
    </div>
  );
}

export default MetaDataView;
