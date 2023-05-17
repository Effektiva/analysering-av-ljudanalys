
class Sound {
    soundClass: string;
    trustValue: number;

    constructor(
        soundClass: string,
        trustValue: number
    ) {
        this.soundClass = soundClass;
        this.trustValue = trustValue;
    }

    static fromJson(json: any) {
        if (json.sound_class === undefined ||
            json.trust_value === undefined) {
          throw new Error("Invalid json object");
        }
        return new Sound(json.sound_class, json.trust_value);
      }
}

export default Sound;