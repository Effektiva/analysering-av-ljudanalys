import { ItemStatus, ListItemType } from "@/components/ListMenu/ListItemType";
import Metadata from "../SoundAnalysis/Metadata";
import ListItemRepresentable from "../ListItemRepresentable";

/**
 * Soundclip is a soundfile with some extra data
 */
class Soundclip implements ListItemRepresentable {
  id: number | undefined;
  audioElement: HTMLAudioElement | undefined;
  metadata: Metadata;
  startTime: Date;
  endTime: Date;
  duration: number;
  state: string;

  constructor(
    id: number | undefined,
    metadata: Metadata,
    startTime: Date,
    endTime: Date,
    state: string,
  ) {
    this.id = id;
    this.metadata = metadata;
    this.startTime = startTime;
    this.endTime = endTime;
    this.duration = (this.endTime.valueOf() - this.startTime.valueOf())/1000; // in seconds
    this.state = state;
  }

  asListItem(): ListItemType {
    return {
      id: this.id ?? -1,
      text: this.metadata.fileName,
      collapsable: false,
      state: this.getCurrentItemStatus()
    }
  }

  getCurrentItemStatus(): ItemStatus {
    switch(this.state) {
      case "0":
        return ItemStatus.Untreated;
      case "1":
        return ItemStatus.AnalysisOngoing;
      case "2":
        return ItemStatus.AnalysisSucceeded;
      case "3":
        return ItemStatus.AnalysisFailed;
      case "4":
        return ItemStatus.Treated;
      case "5":
        return ItemStatus.Rejected;
      default:
        return ItemStatus.None;
    }
  }

  setAudioElement(elem: HTMLAudioElement) {
    this.audioElement = elem;
  }

  static fromJson(json: any) {
    if (json.id === undefined ||
        json.startTime === undefined ||
        json.endTime === undefined ||
        json.fileName === undefined ||
        json.state === undefined) {
      throw new Error("Invalid json object");
    }
    let meta = new Metadata(json.fileName, []);
    return new Soundclip(json.id, meta, new Date(json.startTime*1000), new Date(json.endTime*1000), json.state);
  }
}

export default Soundclip;
