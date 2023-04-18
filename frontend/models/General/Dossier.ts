import { ListItemType } from "@/components/ListMenu/ListItemType";
import ListItemRepresentable from "./ListItemRepresentable";

class Dossier implements ListItemRepresentable {
  id: number | undefined;
  name: string;
  subdossiers: Array<Dossier>

  constructor(id: number | undefined, name: string, subdossiers: Array<Dossier> = []) {
    this.id = id;
    this.name = name;
    this.subdossiers = subdossiers;
  }

  public getName(): string {
    return this.name;
  }

  asListItem(): ListItemType {
    return {
      id: this.id ?? -1,
      text: this.name,
      children: this.subdossiers.map(dossier => dossier.asListItem())
    }
  }

}

export default Dossier;

