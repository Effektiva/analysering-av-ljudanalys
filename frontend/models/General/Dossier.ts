import { ListItemType } from "@/components/ListMenu/ListItemType";
import ListItemRepresentable from "../ListItemRepresentable";
import Soundclip from "./Soundclip";

class Dossier implements ListItemRepresentable {
  id: number | undefined;
  name: string;
  subdossiers: Array<Dossier>
  soundfiles: Array<Soundclip>

  constructor(
    id: number | undefined,
    name: string,
    subdossiers: Array<Dossier> = [],
    soundfiles: Array<Soundclip> = []
  ) {
    this.id = id;
    this.name = name;
    this.subdossiers = subdossiers;
    this.soundfiles = soundfiles;
  }

  public getName(): string {
    return this.name;
  }

  asListItem(): ListItemType {
    let children = [
      ...this.subdossiers.map(dossier => dossier.asListItem()),
      ...this.soundfiles.map(soundfile => soundfile.asListItem())
    ];
    return {
      id: this.id ?? -1,
      text: this.name,
      collapsable: children.length != 0,
      subroots: this.subdossiers.map(dossier => dossier.asListItem()),
      children: this.soundfiles.map(soundfile => soundfile.asListItem())
    }
  }

  addableListItems(): ListItemType {
    let children = [
      ...this.subdossiers.map(dossier => dossier.addableListItems())
    ];
    return {
      id: this.id ?? -1,
      text: this.name,
      collapsable: children.length != 0,
      subroots: children
    }
  }

}

export default Dossier;

