import { ListItemType } from "@/components/ListMenu/ListItemType";
import ListItemRepresentable from "./ListItemRepresentable";

class Investigation implements ListItemRepresentable {
  id: number | undefined;
  name: string;

  constructor(id: number | undefined, name: string) {
    this.id = id;
    this.name = name;
  }

  asListItem(): ListItemType {
    return {
      id: this.id ?? -1,
      text: this.name
    }
  }

}

export default Investigation;
