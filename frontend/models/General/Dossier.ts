class Dossier {
  id: number | undefined;
  name: string;

  constructor(id: number | undefined, name: string) {
    this.id = id;
    this.name = name;
  }

  public getName(): string {
    return this.name;
  }
}

export default Dossier;
