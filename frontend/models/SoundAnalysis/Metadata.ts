import Dossier from "../General/Dossier";

enum AnalysisStatus {
  Negative = "Not Analysed",
  Pending = "Analysing... ",
  Positive = "Analysed"
}

class Metadata {
  fileName: string;
  fileFormat: string;
  analysisStatus: string;

  constructor(name: string) {
    this.fileName = name.split(".")[0];
    this.fileFormat = name.split(".")[1];
    this.analysisStatus = AnalysisStatus.Negative;
  }

  public getFileName(): string {
    return this.fileName;
  }

  public getFileFormat(): string {
    return this.fileFormat;
  }

  public getDate(): string {
    return this.fileName.replace(/(\d{4})-(\d{2})-(\d{2})_(\d{2})(\d{2})_(\d{2})(\d{2})/, "$1-$2-$3");
  }

  public getAnalysisStatus(): string {
    return this.analysisStatus;
  }

  public setAnalysisStatus(status: AnalysisStatus, percent: number = 0) {
    this.analysisStatus = status;
    if (status === AnalysisStatus.Pending) {
      this.analysisStatus += percent + "%";
    }
  }
}

export default Metadata;
