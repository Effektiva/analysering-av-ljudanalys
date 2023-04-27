import { ListItemType } from "@/components/ListMenu/ListItemType";
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

  constructor(
    id: number | undefined,
    metadata: Metadata,
    startTime: Date,
    endTime: Date,
  ) {
    this.id = id;
    this.metadata = metadata;
    this.startTime = startTime;
    this.endTime = endTime;
    this.duration = (this.endTime.valueOf() - this.startTime.valueOf())/1000; // in seconds
  }

  asListItem(): ListItemType {
    return {
      id: this.id ?? -1,
      text: this.metadata.fileName,
      collapsable: false
    }
  }

  setAudioElement(elem: HTMLAudioElement) {
    this.audioElement = elem;
  }

  static fromJson(json: any) {
    if (json.id === undefined || json.startTime === undefined || json.endTime === undefined || json.fileName === undefined) {
      throw new Error("Invalid json object");
    }
    let meta = new Metadata(json.fileName, []);
    return new Soundclip(json.id, meta, new Date(json.startTime*1000), new Date(json.endTime*1000));
  }
}

export default Soundclip;
