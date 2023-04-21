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

  static initFromJSON(json: any): SoundChain | undefined {
    let id = json.id as number | undefined;
    let name = json.name as string | undefined;
    let startTime = json.id as Date | undefined;
    let endTime = json.name as Date | undefined;
    let state = json.id as SoundChainState | undefined;
    let comments = json.name as Array<Note> | undefined;
    let soundClips = json.id as Array<Soundclip> | undefined; // code medium

    if (id !== undefined &&
      name !== undefined &&
      startTime !== undefined &&
      endTime !== undefined &&
      state !== undefined &&
      comments !== undefined &&
      soundClips !== undefined) {
      return new SoundChain(id, name, startTime, endTime, state, comments, soundClips);
    } else {
      return undefined;
    }
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
