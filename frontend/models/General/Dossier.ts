import { ListItemType } from "@/components/ListMenu/ListItemType";
import ListItemRepresentable from "../ListItemRepresentable";
import Soundclip from "./Soundclip";
import Metadata from "../SoundAnalysis/Metadata";

/**
 * Represents a collection of soundclips. Can also store subdossiers, but with a maximum depth of 1.
 */
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

  static initFromJSON(json: any): Dossier | undefined {
    let id = json.id as number | undefined;
    let name = json.name as string | undefined;

    let subdossiers: Dossier[] = [];
    if (json.subDossier != undefined) {
      json.subDossier.forEach((doss: any) => {
        let newDossier = Dossier.initFromJSON(doss);
        if (newDossier) {
          subdossiers.push(newDossier);
        }
      });
    }

    let soundfiles: Soundclip[] = [];
    json.soundFiles.forEach((file: any) => {
      soundfiles.push(new Soundclip(file.id, new Metadata(file.fileName, []), new Date(0), new Date(0)));
    });

    if (id !== undefined && name !== undefined && subdossiers !== undefined && soundfiles !== undefined) {
      return new Dossier(id, name, subdossiers, soundfiles);
    } else {
      return undefined;
    }
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

  /**
   * Returns this dossier and it's subdossiers. These we can add soundclips to in a menu.
   */
  topAndSubDossierListItems(): ListItemType {
    let children = [
      ...this.subdossiers.map(dossier => dossier.topAndSubDossierListItems())
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

