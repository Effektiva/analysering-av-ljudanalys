import Sound from './Sound';

export type GraphData = {
    name: number,
    [key: string] : number
}

/**
 * SoundInterval is a interval of a soundfile
 * containing soundClass data
 */
class SoundInterval {
  startTime: number;
  endTime: number;
  highestVolume: number;
  sounds: Array<Sound>;

  constructor(
    startTime: number,
    endTime: number,
    highestVolume: number,
    sounds: Array<Sound>
  ) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.highestVolume = highestVolume;
    this.sounds = sounds;
  }

  static fromJson(json: any) {
    let sounds = [] as Array<Sound>;
    if (json.sounds != undefined) {
      json.sounds.forEach((sound: any) => {
        sounds.push(Sound.fromJson(sound));
      });
    }

    if (json.start_time === undefined ||
        json.end_time === undefined ||
        json.highest_volume === undefined ||
        sounds === undefined) {
      throw new Error("Invalid json object");
    }
    return new SoundInterval(json.start_time, json.end_time, json.highest_volume, sounds);
  }

  asGraphData(clip_start: number = 0, offset: number = 0): GraphData {
    let graphData : GraphData = {name: this.startTime - clip_start + (this.endTime - this.startTime) / 2 + offset};
    this.sounds.forEach(sound => {
        graphData[sound.soundClass] = sound.trustValue;
    });

    return graphData;
  }
}

export default SoundInterval;
