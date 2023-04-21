import axios from 'axios';
import Investigation from './General/Investigation';
import { DUMMY_DOSSIER_LIST, DUMMY_INVESTIGATION_LIST } from '@/modules/DummyData';
import { LOG as log } from '@/pages/_app';
import Dossier from './General/Dossier';

// FIX ME PLOX WHEN BACKEND NO HIDE :3
class APIService {

  static apiURL = "http://localhost:3000";

  constructor() {
  }

  // API CALL TO BACKEND
  static getInvestigations = async (): Promise<Investigation[]> => {
    return DUMMY_INVESTIGATION_LIST;
    const result = await axios.get(this.apiURL + "/investigations");
    const jsonData = result.data.get(0);
    if (jsonData !== undefined) {
      const jsonArray = jsonData;
      var investigations: Investigation[] = [];
      for (const jsonInvestigation in jsonArray) {
        const investigation = Investigation.initFromJSON(jsonInvestigation);
        if (investigation !== undefined) {
          investigations.push(investigation);
        } else {
          log.warning("Could not create investigation from JSON: " + jsonInvestigation);
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
      const jsonArray = jsonData;
      var dossiers: Dossier[] = [];
      for (const jsonDossier in jsonArray) {
        const dossier = Dossier.initFromJSON(jsonDossier);
        if (dossier !== undefined) {
          dossiers.push(dossier);
        } else {
          log.warning("Could not create dossier from JSON: " + jsonDossier);
        }
      }
      return dossiers;
    } else {
      return [];
    }
  }

}

export default APIService;
