import axios from 'axios';
import Investigation from './General/Investigation';
import { LOG as log } from '@/pages/_app';
import Dossier from './General/Dossier';
import SoundChain from './General/SoundChain';

class APIService {
  static apiURL = "http://localhost:8000";
  static filehostURL = "http://localhost:8080";

  /*
   * Investigations
   */
  static getInvestigations = async (): Promise<Investigation[]> => {
    const result = await axios.get(this.apiURL + "/investigations");
    const jsonData = result.data;
    if (jsonData !== undefined) {
      var investigations: Investigation[] = [];
      for (let index = 0; index < jsonData.length; index++) {
        const investigation = Investigation.initFromJSON(jsonData[index]);
        if (investigation !== undefined) {
          investigations.push(investigation);
        } else {
          log.warning("Could not create investigation from: " + jsonData[index]);
        }
      }
      return investigations;
    } else {
      return [];
    }
  }

  static createInvestigation = async (name: String): Promise<number> => {
    return await axios.post(this.apiURL + "/investigations", { "name": name })
      .then((response: any) => {
        if (response.status === 200) {
          return response.data.id;
        } else {
          return Promise.reject(response);
        }
      });
  }

  static changeInvestigationName = async (id: number, name: string) => {
    await axios.put(this.apiURL + "/investigations", { "id": id, "name": name })
      .then((response: any) => {
        if (response.status !== 200) {
          log.warning("Couldn't change investigation name:", response);
        }
      });
  }

  static deleteInvestigation = async (id: number) => {
    await axios.delete(this.apiURL + "/investigations", { data: { "id": id } });
  }

  /*
   * Soundchains
   */
  static getSoundChainsForInvestigation = async (investigationId: number): Promise<SoundChain[]> => {
    log.debug("Fetching soundchains for investigation:", investigationId);
    const result = await axios.get(this.apiURL + "/investigations/" + investigationId + "/soundchains");
    const jsonData = result.data;

    if (jsonData !== undefined) {
      var soundchains: SoundChain[] = [];
      for (let index = 0; index < jsonData.length; index++) {
        const soundchain = SoundChain.initFromJSON(jsonData[index]);
        if (soundchain !== undefined) {
          soundchains.push(soundchain);
        } else {
          log.warning("Could not create soundchains from: " + jsonData[index]);
        }
      }
      return soundchains;
    } else {
      return [];
    }
  }

  static getFullSoundChain = async (investigationId: number, soundchainId: number): Promise<SoundChain> => {
    return await axios.get(this.apiURL + "/investigations/" + investigationId + "/soundchains/" + soundchainId)
      .then((result: any) => {
        const jsonData = result.data;
        if (jsonData !== undefined) {
          let soundchain = SoundChain.initFromJSON(jsonData);
          if (soundchain !== undefined) {
            return soundchain;
          }
        }
        return Promise.reject("Couldn't create soundchain from:" + jsonData);
      });
  }

  static deleteSoundchain = async (investigationId: number, soundchainId: number) => {
    log.debug("Delete from investigation", investigationId, "soundchain", soundchainId)
    return await axios.delete(
      this.apiURL + "/investigations/" + investigationId + "/soundchains",
      { data: { "id": soundchainId } }
    );
  }

  static createSoundchain = async (investigationId: number, fileList: FileList) => {
    log.debug("Creating soundchain out of:", fileList);
    const data = new FormData();
    Array.prototype.forEach.call(fileList, (file: any) => {
      data.append("files", file);
    });
    return await axios({
      method: "post",
      url: this.apiURL + "/investigations/" + investigationId + "/soundchains",
      data: data,
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data"
      }
    });
  }

  static setSoundchainState = async (investigationId: number, soundchainId: number, state: number) => {
    log.debug("Change state of", soundchainId, "to", state);
    return await axios.put(
      this.apiURL + "/investigations/" + investigationId + "/soundchains/",
      { "id": soundchainId, "state": state }
    )
  }

  /*
   * Dossiers
   */
  static getDossiers = async (): Promise<Dossier[]> => {
    const result = await axios.get(this.apiURL + "/dossier");
    const jsonData = result.data;
    if (jsonData !== undefined) {
      var dossiers: Dossier[] = [];
      for (let index = 0; index < jsonData.length; index++) {
        const dossier = Dossier.initFromJSON(jsonData[index]);
        if (dossier !== undefined) {
          dossiers.push(dossier);
        } else {
          log.warning("Could not create dossier from: " + jsonData[index]);
        }
      }
      return dossiers;
    } else {
      return [];
    }
  }

  static createDossier = async (name: String): Promise<number> => {
    return await axios.post(this.apiURL + "/dossier", { "name": name })
      .then((response: any) => {
        if (response.status === 200) {
          return response.data.id;
        } else {
          return Promise.reject(response);
        }
      });
  }

  static createSubDossier = async (parentId: number, subName: string): Promise<number> => {
    return await axios.post(this.apiURL + "/dossier/" + parentId, { "name": subName })
      .then((response: any) => {
        if (response.status === 200) {
          return response.data.id;
        } else {
          return Promise.reject(response);
        }
      });
  }


  static changeDossierName = async (id: number, name: string) => {
    log.debug("Change name of", id, "to", name);
    return await axios.put(this.apiURL + "/dossier", { "id": id, "name": name });
  }

  static deleteDossier = async (id: number) => {
    await axios.delete(this.apiURL + "/dossier", { data: { "id": id } });
  }

  static addSoundfileToDossier = async (dossierId: number, soundfileId: number) => {
    await axios.post(this.apiURL + "/dossier/add/" + soundfileId, { "id": dossierId });
  }

  static deleteSoundfileFromDossier = async (dossierId: number, soundfileId: number) => {
    await axios.delete(this.apiURL + "/dossier/delete/" + soundfileId, { data: { "id": dossierId } })
      .then((response: any) => {
        if (response.status !== 200) {
          log.warning("Couldn't remove soundfile from dossier:", response);
        }
      });
  }

  static exportDossier = async (dossierId: number) => {
    log.debug("Exporting dossier", dossierId);
    window.open(APIService.apiURL + "/dossier/export/" + dossierId);
  }

  /*
   * Soundfiles
   */
  static getSoundfileInfo = async (id: number): Promise<{ investigation: number, soundchain: number }> => {
    return await axios.get(this.apiURL + "/info/soundfile/" + id)
      .then((response: any) => {
        if (response.status === 200) {
          return response.data;
        } else {
          return Promise.reject(response.status);
        }
      });
  }

  static setStatusOnSoundfile = async (
    investigationId: number,
    soundchainId: number,
    soundfileId: number,
    state: number
  ) => {
    log.debug("Change status of", soundfileId, "to", state);
    await axios.put(
      this.apiURL + "/investigations/" + investigationId +
      "/soundchains/" + soundchainId +
      "/soundfiles/" + soundfileId,
      { "id": soundfileId, "state": state }
    );
  }

  /*
   * Notes
   */
  static addComment = async (
    investigationId: number,
    soundchainId: number,
    clipId: number,
    time: number,
    text: string
  ): Promise<any> => {
    return await axios.post(
      this.apiURL + "/investigations/" + investigationId +
      "/soundchains/" + soundchainId + "/comments",
      { "time": time, "text": text, "fileId": clipId })
      .then((response: any) => {
        if (response.status === 200) {
          const comment = response.data.comment;
          if (comment != undefined) {
            log.debug("New note:", comment);
          }
          return comment;
        } else {
          return Promise.reject(response.status);
        }
      });
  }

  static deleteComment = async (
    investigationId: number,
    soundchainId: number,
    commentId: number
  ) => {
    log.debug("Deleting note of id:", commentId);
    return await axios.delete(
      this.apiURL + "/investigations/" + investigationId +
      "/soundchains/" + soundchainId +
      "/comments",
      { data: { "id": commentId } }
    );
  }

  static updateComment = async (
    investigationId: number,
    soundchainId: number,
    commentId: number,
    text: string
  ) => {
    log.debug("Changing text of note of id", commentId, "with text:", text);
    await axios.put(
      this.apiURL + "/investigations/" + investigationId +
      "/soundchains/" + soundchainId + "/comments",
      { "id": commentId, "text": text }
    );
  }

  /*
   * Misc
   */
  static getAllSoundClasses = async (): Promise<any[]> => {
    return await axios.get(this.apiURL + "/sound_class").then((response: any) => {
      if (response.status === 200) {
        return response.data;
      } else {
        return Promise.reject(response.status);
      }
    });
  }

  static analyzeInvestigationSoundChains = async (id: number) => {
    log.debug("Analyzing investigation ", id);
    await axios.post(
      this.apiURL + "/investigations/" + id + "/analyze"
    ).then((response: any) => {
      log.debug("Response is: ", response);
    });
  }

  static analyzeStatus = async (id: number) => {
    log.debug("Status analysis");
    await axios.get(
      this.apiURL + "/investigations/" + id + "/analyze"
    ).then((response: any) => {
      log.debug("Response is: ", response.data);
      return response.data;
    });
  }
}

export default APIService;
