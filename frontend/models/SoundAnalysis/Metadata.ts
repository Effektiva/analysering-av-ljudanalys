import Dossier from "../General/Dossier";

class Metadata {
  fileName: string;
  fileFormat: string;

  constructor(name: string) {
    this.fileName = name.split(".")[0];
    this.fileFormat = name.split(".")[1];
  }

  public getFileName(): string {
    return this.fileName;
  }

  public getFileFormat(): string {
    return this.fileFormat;
  }

  public getDate(): string {
    return this.fileName.replace(/(\d{4})-(\d{2})-(\d{2})_(\d{2})(\d{2})_(\d{2})(\d{2})/, "$3-$2-$1");
  }
}

export default Metadata;
