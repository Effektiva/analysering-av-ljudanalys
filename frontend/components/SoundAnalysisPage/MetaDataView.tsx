import Metadata from "@/models/SoundAnalysis/Metadata";
import { LOG as log } from "@/pages/_app"

type Props = {
  metaData: Metadata | undefined;
}

const STYLE_NAMESPACE = "metadata__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
  Header = STYLE_NAMESPACE + "header",
  MetadataName = STYLE_NAMESPACE + "name",
  MetadataStatus = STYLE_NAMESPACE + "status",
  MetadataDate = STYLE_NAMESPACE + "date",
  MetadataFormat = STYLE_NAMESPACE + "format",
  MetadataDossiers = STYLE_NAMESPACE + "dossiers",
  MetadataDossiersDiv = STYLE_NAMESPACE + "dossiersDiv",
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
          <span className={Style.MetadataStatus}> <b>Analys status:</b> {props.metaData?.getAnalysisStatus()}</span>
          <span className={Style.MetadataDate}> <b>Datum:</b> {props.metaData?.getDate()}</span>
          <span className={Style.MetadataDate}> <b>Filformat:</b> {props.metaData?.getFileFormat()}</span>
        </div>
    </div>
  );
}

export default MetadataView;
