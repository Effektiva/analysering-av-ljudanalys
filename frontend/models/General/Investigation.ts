import { ListItemType } from "@/components/ListMenu/ListItemType";
import ListItemRepresentable from "../ListItemRepresentable";
import SoundChain from "./SoundChain";

/**
 * Represents an investigation that holds several soundchains.
 */
class Investigation implements ListItemRepresentable {
  id: number | undefined;
  name: string;
  soundChains: Array<SoundChain>;

  constructor(id: number | undefined, name: string, soundChains: Array<SoundChain>) {
    this.id = id;
    this.name = name;
    this.soundChains = soundChains;
  }

  asListItem(): ListItemType {
    return {
      id: this.id ?? -1,
      text: this.name,
      collapsable: false
    }
  }

  static initFromJSON(json: any): Investigation | undefined {
    let id = json.id as number | undefined;
    let name = json.name as string | undefined;
    let soundChains: SoundChain[] = []; // TODO: FIX ME PLOX, actual sound chain plz

    if (id !== undefined && name !== undefined && soundChains !== undefined) {
      return new Investigation(id, name, soundChains);
    } else {
      return undefined;
    }
  }

}

export default Investigation;
