import Dossier from "../General/Dossier";

class Metadata {
  name: string;
  belongingDossiers: Array<Dossier>;

  constructor(name: string, belongingDossiers: Array<Dossier>) {
    this.name = name;
    this.belongingDossiers = belongingDossiers;
  }

  public getName(): string {
    return this.name;
  }

  public getDate(): string {
    return this.name.replace(/(\d{4})-(\d{2})-(\d{2})_(\d{2})(\d{2})_(\d{2})(\d{2})/, "$3-$2-$1");
  }

  public getBelongingDossiers(): Array<Dossier> {
    return this.belongingDossiers;
  }
}

export default Metadata;
