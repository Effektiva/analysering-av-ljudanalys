import Metadata from "@/models/SoundAnalysis/Metadata";

type Props = {
  metaData: Metadata | undefined;
}

const STYLE_NAMESPACE = "metadata__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
  Header = STYLE_NAMESPACE + "header",
  MetadataName = STYLE_NAMESPACE + "metadata-name",
  MetadataDate = STYLE_NAMESPACE + "metadata-date",
  MetadataFormat = STYLE_NAMESPACE + "metadata-format",
  MetadataDossiers = STYLE_NAMESPACE + "metadata-dossiers",
  MetadataDossiersDiv = STYLE_NAMESPACE + "metadata-dossiers-div",
}

/**
 * MetaDataView displays the metadata of a sound file. Displays the name, date of recording and a list of the dossiers it belongs to. Shows the name of the dossier
 * @param props - The metadata to display.
 */
const MetadataView = (props: Props) => {
  return (
    <div className={Style.Container}>
      <div className={Style.Header}>Metadata</div>
        <div>
          <span className={Style.MetadataName}> <b>Filnamn:</b> {props.metaData?.getFileName()}</span>
          <span className={Style.MetadataDate}> <b>Datum:</b> {props.metaData?.getDate()}</span>
          <span className={Style.MetadataDate}> <b>Filformat:</b> {props.metaData?.getFileFormat()}</span>
        </div>
    </div>
  );
}

export default MetadataView;
