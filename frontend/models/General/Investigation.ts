import { ListItemType } from "@/components/ListMenu/ListItemType";
import ListItemRepresentable from "../ListItemRepresentable";

/**
 * Represents an investigation that holds several soundchains.
 */
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
      text: this.name,
      collapsable: false
    }
  }

}

export default Investigation;
