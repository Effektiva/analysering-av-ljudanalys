import { ListItemType } from "@/components/ListMenu/ListItemType";
import ListItemRepresentable from "../ListItemRepresentable";

export type InvestigationJSON = {
  id: number,
  name: string
}

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

  static initFromJSON(json: InvestigationJSON): Investigation | undefined {
    let id = json.id as number | undefined;
    let name = json.name as string | undefined;

    if (id !== undefined && name !== undefined) {
      return new Investigation(id, name);
    } else {
      return undefined;
    }
  }

}

export default Investigation;
