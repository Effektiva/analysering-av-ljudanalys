import { ListItemType } from "@/components/ListMenu/ListItemType";
import Metadata from "../SoundAnalysis/Metadata";
import ListItemRepresentable from "../ListItemRepresentable";

class Soundclip implements ListItemRepresentable {
  id: number | undefined;
  metadata: Metadata;
  startTime: Date;
  endTime: Date;

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
  }

  asListItem(): ListItemType {
    return {
      id: this.id ?? -1,
      text: this.metadata.fileName,
      collapsable: false
    }
  }
}

export default Soundclip;
