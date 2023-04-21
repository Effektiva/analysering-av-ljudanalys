import axios from 'axios';
import Investigation, { InvestigationJSON } from './General/Investigation';
import { DUMMY_DOSSIER_LIST } from '@/modules/DummyData';
import { LOG as log } from '@/pages/_app';
import Dossier from './General/Dossier';
import SoundChain from './General/SoundChain';
import { DUMMY_SOUNDCHAINS_LIST } from '@/modules/DummyData';
import { DUMMY_SOUNDCHAINS_LIST2 } from '@/modules/DummyData';

// FIX ME PLOX WHEN BACKEND NO HIDE :3
class APIService {

  static apiURL = "http://localhost:3000";

  // API CALL TO BACKEND
  static getInvestigations = async (): Promise<Investigation[]> => {
    const dummyTestJSONData: InvestigationJSON[] = [ {id: 0, name: "Kalles Knarkaffärer"}, {id: 1, name: "Länsmansjäveln"} ];

    // const result = await axios.get(this.apiURL + "/investigations");
    const jsonData = dummyTestJSONData; // result.data.get(0);
    if (jsonData !== undefined) {
      var investigations: Investigation[] = [];
      for (let index = 0; index < dummyTestJSONData.length; index++) {
        const investigation = Investigation.initFromJSON(dummyTestJSONData[index]);
        if (investigation !== undefined) {
          investigations.push(investigation);
        } else {
          log.warning("Could not create investigation from: " + dummyTestJSONData[index]);
        }
      }
      return investigations;
    } else {
      return [];
    }
  }

  static getDossiers = async (): Promise<Dossier[]> => {
    return DUMMY_DOSSIER_LIST;
    const result = await axios.get(this.apiURL + "/dossier");
    const jsonData = result.data.get(0);
    if (jsonData !== undefined) {
      var dossiers: Dossier[] = [];
      for (let index = 0; index < jsonData.length; index++) {
        const dossier = Dossier.initFromJSON(jsonData[index]);
        if (dossier !== undefined) {
          dossiers.push(dossier);
        } else {
          log.warning("Could not create investigation from: " + jsonData[index]);
        }
      }
      return dossiers;
    } else {
      return [];
    }
  }

  static getSoundChainsForInvestigation = async (investigationId: number): Promise<SoundChain[]> => {
    // DUMMY
    if (investigationId == 0) {
      return DUMMY_SOUNDCHAINS_LIST;
    } else {
      return DUMMY_SOUNDCHAINS_LIST2;
    }

    // Actual
    const result = await axios.get(this.apiURL + "/investigations/" + investigationId + "/soundchains");
    const jsonData = result.data.get(0);

    if (jsonData !== undefined) {
      var soundchains: SoundChain[] = [];
      for (let index = 0; index < jsonData.length; index++) {
        const soundchain = SoundChain.initFromJSON(jsonData[index]);
        if (soundchain !== undefined) {
          soundchains.push(soundchain);
        } else {
          log.warning("Could not create investigation from: " + jsonData[index]);
        }
      }
      return soundchains;
    } else {
      return [];
    }
  }

}

export default APIService;
