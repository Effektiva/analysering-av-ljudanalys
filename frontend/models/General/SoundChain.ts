import { ListItemType, ItemStatus } from "@/components/ListMenu/ListItemType";
import Note from "../SoundAnalysis/Note";
import ListItemRepresentable from "../ListItemRepresentable";
import Soundclip from "./Soundclip";
import APIService from "../APIService";
import { LOG as log } from "@/pages/_app";

/**
 * A SoundChain is a collection of SoundClips that are played in a specific order.
 */
class SoundChain implements ListItemRepresentable {
  id: number | undefined;
  name: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  state: string;
  comments: Array<Note>;
  soundClips: Array<Soundclip>;
  soundClasses: Array<any>;

  constructor(
    id: number | undefined,
    name: string,
    startTime: Date,
    endTime: Date,
    state: string,
    comments: Array<Note>,
    soundClips: Array<Soundclip>,
    soundClasses: Array<any>
  ) {
    this.id = id;
    this.name = name;
    this.startTime = startTime;
    this.endTime = endTime;
    this.duration = (this.endTime.valueOf() - this.startTime.valueOf())/1000; // in seconds
    this.state = state;
    this.comments = comments;
    this.soundClips = soundClips;
    this.soundClasses = soundClasses;
  }

  static initFromJSON(json: any): SoundChain | undefined {
    let id = json.id as number | undefined;
    let startTime = new Date(json.startTime*1000);
    let endTime = new Date(json.endTime*1000);
    let state = json.state as string;
    let soundClasses = json.soundClasses;

    let name = "undefined starttime";
    if (startTime != undefined) {
      name = startTime.toISOString().split('T')[0];
    }

    let comments = [] as Array<Note>;
    if (json.comments != undefined) {
      json.comments.forEach((note: any) => {
        comments.push(Note.fromJson(note));
      });
    }

    let soundClips = [] as Array<Soundclip>;
    if (json.soundFiles != undefined) {
      json.soundFiles.forEach((file: any) => {
        soundClips.push(Soundclip.fromJson(file));
      });
    }

    if (id !== undefined &&
        name !== undefined &&
        startTime !== undefined &&
        endTime !== undefined &&
        state !== undefined &&
        comments !== undefined &&
        soundClips !== undefined &&
        soundClasses !== undefined) {
      return new SoundChain(id, name, startTime, endTime, state, comments, soundClips, soundClasses);
    } else {
      return undefined;
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

  asListItem(): ListItemType {
    return {
      id: this.id ?? -1,
      text: this.name,
      collapsable: false,
      state: this.getCurrentItemStatus()
    }
  }

  /*
   * Returns a soundclip if it exists in this.soundClips, otherwise returns
   * undefined. Also sets the audioElement for the Soundclip.
   */
  getSoundclip(id: number): Soundclip | undefined {
    let index = this.soundClips.findIndex(x => x.id == id);
    let clip = this.soundClips.at(index);
    return clip;
  }

  /*
   * Returns a soundclip if it exists in this.soundClips, otherwise returns
   * undefined. Also sets the audioElement for the Soundclip.
   */
  getSoundclipAndSetAudioElement(investigationId: number, fileId: number): Soundclip | undefined {
    let index = this.soundClips.findIndex(x => x.id == fileId);
    let clip = this.soundClips.at(index);
    clip?.setAudioElement(new Audio(this.getSoundclipURL(investigationId, clip)));
    return clip;
  }

  /*
   * Returns the URL for the data of the soundfile that represents
   * the souncdclip with `id`.
   */
  getSoundclipURL(investigationId: number, clip: Soundclip) {
    return APIService.filehostURL + "/" + investigationId + "/" +
                                    "/" + this.id + "/" +
                                    "/files/" + clip.id + "." + clip.metadata.getFileFormat();
  }

  /*
   * Returns the number of seconds from the start of the soundchain
   * up until the clip with `id`. Returns -1 if something goes wrong.
   */
  getSecondsToStartOfClip(clip: Soundclip): number {
    return (clip.startTime.valueOf() - this.startTime.valueOf())/1000;
  }

  /*
   * Returns the Soundclip after `clip`, if there's none returns undefined.
   */
  getNextClipAndSetAudioElement(investigationId: number, clip: Soundclip): Soundclip | undefined {
    let currentIndex = this.soundClips.findIndex(x => x == clip);
    if (currentIndex != undefined) {
      if (this.soundClips.at(currentIndex + 1) != undefined) {
        let newID = this.soundClips.at(currentIndex + 1)?.id;
        if (newID != undefined) {
          return this.getSoundclipAndSetAudioElement(investigationId, newID);
        }
      } else {
        return undefined;
      }
    }
  }

  getCommentsForClip(clipId: number): Array<Note> {
    let comments: Array<Note> = [];
    this.comments.forEach((note: Note) => {
      if (note.soundfileId == clipId) {
        comments.push(note);
      }
    });
    return comments;
  }
}

export default SoundChain;
