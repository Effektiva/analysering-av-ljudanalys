import { ListItemType } from "@/components/ListMenu/ListItemType";
import ListItemRepresentable from "./ListItemRepresentable";

class Dossier implements ListItemRepresentable{
  id: number | undefined;
  name: string;

  constructor(id: number | undefined, name: string) {
    this.id = id;
    this.name = name;
  }

  public getName(): string {
    return this.name;
  }

  asListItem(): ListItemType {
    return {
      id: this.id ?? -1,
      text: this.name
    }
  }
}

export default Dossier;
