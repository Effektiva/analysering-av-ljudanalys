import { ListItemType } from "@/components/ListMenu/ListItemType";
import Note from "../SoundAnalysis/Note";
import ListItemRepresentable from "./ListItemRepresentable";
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

  asListItem(): ListItemType {
    return {
      id: this.id ?? -1,
      text: this.name
    }
  }
}

export default SoundChain;
