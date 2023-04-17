import Metadata from "@/models/SoundAnalysis/Metadata";

type Props = {
  metaData: Metadata;
}

const STYLE_NAMESPACE = "metadata__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
  Header = STYLE_NAMESPACE + "header",
  MetadataName = STYLE_NAMESPACE + "metadata-name",
  MetadataDate = STYLE_NAMESPACE + "metadata-date",
  MetadataDossiers = STYLE_NAMESPACE + "metadata-dossiers",
  Metadata = STYLE_NAMESPACE + "metadata"
}

/**
 * MetaDataView displays the metadata of a sound file. Displays the name, date of recording and a list of the dossiers it belongs to. Shows the name of the dossier
 * @param props - The metadata to display.
 */
const MetadataView = (props: Props) => {
  // 
  return (
    <div className={Style.Container}>
      <div className={Style.Header}>Metadata</div>
        <div>
          <span className={Style.MetadataName}> <b>Filnamn:</b> {props.metaData.getName()}</span>
          <span className={Style.MetadataDate}> <b>Datum:</b> {props.metaData.getDate()}</span>
        </div>
        <div>
          <span className={Style.MetadataDossiers}> <b>Dossiers:</b> {props.metaData.getBelongingDossiers().map(dossier => "'" + dossier.getName() + "'").join(", \n")}</span>
        </div>
    </div>
  );
}

export default MetadataView;
