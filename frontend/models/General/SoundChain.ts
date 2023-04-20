import { ListItemType, ItemStatus } from "@/components/ListMenu/ListItemType";
import Note from "../SoundAnalysis/Note";
import ListItemRepresentable from "../ListItemRepresentable";
import SoundChainState from "./SoundChainState";
import Soundclip from "./Soundclip";

/**
 * A SoundChain is a collection of SoundClips that are played in a specific order.
 */
class SoundChain implements ListItemRepresentable {
  id: number | undefined;
  name: string;
  startTime: Date;
  endTime: Date;
  state: SoundChainState;
  comments: Array<Note>;
  soundClips: Array<Soundclip>;

  constructor(
    id: number | undefined,
    name: string,
    startTime: Date,
    endTime: Date,
    state: SoundChainState,
    comments: Array<Note>,
    soundClips: Array<Soundclip>
  ) {
    this.id = id;
    this.name = name;
    this.startTime = startTime;
    this.endTime = endTime;
    this.state = state;
    this.comments = comments;
    this.soundClips = soundClips;
  }

  private currentItemStatus(): ItemStatus {
    switch (this.state) {
      case SoundChainState.Analysed:
      case SoundChainState.ManuallyAnalysed:
        return ItemStatus.Complete;
      case SoundChainState.AnalysisOngoing:
        return ItemStatus.Running;
      case SoundChainState.Rejected:
        return ItemStatus.Rejected;
      case SoundChainState.UnAnalysed:
      default:
        return ItemStatus.None;
    }
  }

  asListItem(): ListItemType {
    return {
      id: this.id ?? -1,
      text: this.name,
      collapsable: false,
      status: this.currentItemStatus()
    }
  }
}

export default SoundChain;
