import Dossier from "../General/Dossier";

class Metadata {
  fileName: string;
  belongingDossiers: Array<Dossier>;

  constructor(name: string, belongingDossiers: Array<Dossier>) {
    this.fileName = name;
    this.belongingDossiers = belongingDossiers;
  }

  public getFileName(): string {
    return this.fileName;
  }

  public getDate(): string {
    return this.fileName.replace(/(\d{4})-(\d{2})-(\d{2})_(\d{2})(\d{2})_(\d{2})(\d{2})/, "$3-$2-$1");
  }

  public getBelongingDossiers(): Array<Dossier> {
    return this.belongingDossiers;
  }
}

export default Metadata;
