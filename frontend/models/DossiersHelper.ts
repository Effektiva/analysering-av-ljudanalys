import APIService from "./APIService";
import Dossier from "./General/Dossier";
import { LOG as log } from "@/pages/_app";
import Soundclip from "./General/Soundclip";

// TODO: Maybe remake into a DossierCollection class that appState owns instead of an array of
// dossiers?
class DossiersHelper {
  static changeText = (dossiers: Array<Dossier>, dossierId: number, text: string): Dossier[] => {
    let newDossiers = [...dossiers];
    let indexes = DossiersHelper.findDossier(dossiers, dossierId);
    let root = (indexes.root != -1 && indexes.subroot == -1);
    let found = ((indexes.root != -1 && indexes.subroot != -1) || root);

    if (!found) {
      log.warning("Couldn't find dossier:", dossierId);
      log.warning("Dossiers:", newDossiers);
    } else if (root) {
      newDossiers[indexes.root].name = text;
      APIService.changeDossierName(indexes.root, text);
    } else {
      newDossiers[indexes.root].subdossiers[indexes.subroot].name = text;
      APIService.changeDossierName(indexes.subroot, text);
    }

    return newDossiers;
  }

  static createSubdossier = async (dossiers: Array<Dossier>, parentId: number): Promise<Dossier[]> => {
    let newDossiers = [...dossiers];
    let index = dossiers.findIndex((elem) => elem.id === parentId);
    let name = "Ny subdossier " + dossiers[index].subdossiers.length;
    let id = await APIService.createSubDossier(parentId, name);
    newDossiers[index].subdossiers.push(new Dossier(id, name, [], []));
    return newDossiers;
  }

  static removeDossier = (dossiers: Array<Dossier>, dossierId: number): Dossier[] => {
    let newDossiers = [...dossiers];
    let indexes = DossiersHelper.findDossier(dossiers, dossierId);
    let root = (indexes.root != -1 && indexes.subroot == -1);
    let found = ((indexes.root != -1 && indexes.subroot != -1) || root);

    if (!found) {
      log.warning("Couldn't find dossier:", dossierId);
      log.warning("Dossiers:", newDossiers);
    } else if (root) {
      let index = dossiers.findIndex((dos) => dos.id == dossierId);
      newDossiers.splice(index, 1);
      APIService.deleteDossier(dossierId);
    } else {
      let parent = newDossiers[indexes.root];
      let childIndex = parent.subdossiers!.findIndex((elem) => elem.id == dossierId);
      parent.subdossiers.splice(childIndex, 1);
      APIService.deleteDossier(dossierId);
    }

    return newDossiers;
  }

  static removeSoundfile = (dossiers: Array<Dossier>, parentId: number, fileId: number): Dossier[] => {
    let newDossiers = [...dossiers];
    let indexes = DossiersHelper.findSoundfile(dossiers, parentId, fileId);
    let rootChild = (indexes.root != -1 && indexes.subroot == -1);
    let found = ((indexes.root != -1 && indexes.subroot != -1) || rootChild && indexes.child != -1);

    if (!found) {
      log.warning("Couldn't find (", parentId, ".", fileId, ") soundfile in any dossier:", indexes);
      log.warning("Dossiers:", newDossiers);
      return newDossiers;
    } else if (rootChild) {
      newDossiers[indexes.root].soundfiles.splice(indexes.child, 1);
      let dossierID = newDossiers[indexes.root].id;
      APIService.deleteSoundfileFromDossier(dossierID!, fileId)
    } else {
      newDossiers[indexes.root].subdossiers[indexes.subroot].soundfiles.splice(indexes.child, 1);
      let dossierID = newDossiers[indexes.root].subdossiers[indexes.subroot].id;
      APIService.deleteSoundfileFromDossier(dossierID!, fileId)
    }

    return newDossiers;
  }

  static addFileToDossier(dossiers: Array<Dossier>, dossierId: number, soundfile: Soundclip): Dossier[] {
    let newDossiers = [...dossiers];
    let indexes = DossiersHelper.findDossier(dossiers, dossierId);
    let rootDossier = indexes.root != -1 && indexes.subroot == -1;
    let found = rootDossier || (indexes.root != -1 && indexes.subroot != -1);

    if (!found) {
      log.warning("Couldn't find the dossier (", dossierId, ".", soundfile.id, ") to add the soundfile to:", indexes);
      log.warning("Dossiers:", newDossiers);
      return newDossiers;
    } else if (rootDossier) {
      if (newDossiers[indexes.root].soundfiles.findIndex((clip: Soundclip) => clip.id == soundfile.id) == -1) {
        newDossiers[indexes.root].soundfiles.push(soundfile);
        APIService.addSoundfileToDossier(dossierId, soundfile.id!);
      }
    } else {
      if (newDossiers[indexes.root].
          subdossiers[indexes.subroot].
          soundfiles.findIndex((clip: Soundclip) => clip.id == soundfile.id) == -1) {
        newDossiers[indexes.root].subdossiers[indexes.subroot].soundfiles.push(soundfile);
        APIService.addSoundfileToDossier(dossierId, soundfile.id!);
      }
    }

    return newDossiers;
  }

  /*
   * Internal helpers
   */
  static findDossier = (dossiers: Array<Dossier>, id: number): { root: number, subroot: number} => {
    let indexes = {root: -1, subroot: -1};

    dossiers.some((root, ri) => {
      if (root.id == id) {
        indexes.root = ri;
        return true;
      } else {
        let found = root.subdossiers.some((sub, si) => {
          if (sub.id == id) {
            indexes.root = ri;
            indexes.subroot = si;
            return true;
          }
        });
        if (found) return true;
      }
    });

    return indexes;
  }

  static findSoundfile = (dossiers: Array<Dossier>, parentId: number, fileId: number): { root: number, subroot: number, child: number} => {
    let i = DossiersHelper.findDossier(dossiers, parentId);
    let indexes = {root: i.root, subroot: i.subroot, child: -1};

    if (i.root != -1 && i.subroot != -1) {
      indexes.child = dossiers[i.root].subdossiers[i.subroot].soundfiles.findIndex((clip: Soundclip) => clip.id == fileId);
    } else if (i.root != -1 && i.subroot == -1) {
      indexes.child = dossiers[i.root].soundfiles.findIndex((clip: Soundclip) => clip.id == fileId);
    }

    return indexes;
  }
}

export default DossiersHelper;
