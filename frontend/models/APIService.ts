import axios from 'axios';
import Investigation from './General/Investigation';
import { LOG as log } from '@/pages/_app';
import Dossier from './General/Dossier';
import SoundChain from './General/SoundChain';

class APIService {
  static apiURL = "http://localhost:8000";

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
    let result = -1;

    await axios.post(this.apiURL + "/investigations", { "name": name }).
                then((response: any) => {
                  if (response.status === 200) {
                    result = response.data.id;
                  } else {
                    log.warning("Couldn't create investigation:", response);
                  }
                });

    return result;
  }

  static changeInvestigationName = async (id: number, name: string) => {
    await axios.put(this.apiURL + "/investigations", {"id": id, "name": name}).
                then((response: any) => {
                  if (response.status !== 200) {
                    log.warning("Couldn't change investigation name:", response);
                  }
                });
  }

  static deleteInvestigation = async (id: number) => {
    await axios.delete(this.apiURL + "/investigations", {data: {"id": id}}).
                then((response: any) => {
                  if (response.status !== 200) {
                    log.warning("Couldn't remove investigation:", response);
                  }
                });
  }

  /*
   * Soundchains
   */
  static getSoundChainsForInvestigation = async (investigationId: number): Promise<SoundChain[]> => {
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

  static getFullSoundChain = async (investigationID: number, soundchainID: number): Promise<SoundChain | undefined> => {
      const result = await axios.get(this.apiURL + "/investigations/" + investigationID + "/soundchains/" + soundchainID);
      const jsonData = result.data;

      if (jsonData !== undefined) {
        let soundchain: SoundChain | undefined = SoundChain.initFromJSON(jsonData);
        if (soundchain !== undefined) {
            return soundchain;
        } else {
          log.warning("Couldn't create soundchain from:", jsonData);
        }
      }
  }

  static deleteSoundchain = async (investigationID: number, soundchainID: number) => {
    await axios.delete(this.apiURL + "/investigations/" + investigationID + "/soundchains",
                       {data: {"id": soundchainID}}).
                then((response: any) => {
                  if (response.status !== 200) {
                    log.warning("Couldn't remove soundchain:", response);
                  }
                });
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
    let result = -1;

    await axios.post(this.apiURL + "/dossier", { "name": name }).
                then((response: any) => {
                  if (response.status === 200) {
                    result = response.data.id;
                  } else {
                    log.warning("Couldn't create dossier:", response);
                  }
                });

    return result;
  }

  static changeDossierName = async (id: number, name: string) => {
    await axios.put(this.apiURL + "/dossier", {"id": id, "name": name}).
                then((response: any) => {
                  if (response.status !== 200) {
                    log.warning("Couldn't change dossier name:", response);
                  }
                });
  }

  static deleteDossier = async (id: number) => {
    await axios.delete(this.apiURL + "/dossier", {data: {"id": id}}).
                then((response: any) => {
                  if (response.status !== 200) {
                    log.warning("Couldn't remove dossier:", response);
                  }
                });
  }

  static createSubDossier = async (parentID: number, subName: string): Promise<number> => {
    let result = -1;

    await axios.post(this.apiURL + "/dossier/" + parentID, {"name": subName}).
                then((response: any) => {
                  if (response.status === 200) {
                    result = response.data.id;
                  } else {
                    log.warning("Couldn't create subdossier:", response);
                  }
                });

    return result;
  }

  /*
   * Soundfiles
   */
  static getSoundfileInfo = async (id: number): Promise<{investigation: number, soundchain: number}> => {
    let result = {investigation: -1, soundchain: -1};
    await axios.get(this.apiURL + "/info/soundfile/" + id).
                then((response: any) => {
                  if (response.status === 200) {
                    result = response.data;
                  } else {
                    log.warning("Couldn't get soundfile info:", response);
                  }

                });

    return result;
  }

}

export default APIService;
