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

}

export default Investigation;
