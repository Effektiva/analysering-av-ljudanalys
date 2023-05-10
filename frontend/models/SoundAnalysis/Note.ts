// Class to represent notes containing id, date and time that the note was created and a text for the note
class Note {
  id: number | undefined; // TODO: Denna ska inte vi skapa utan den ska komma från Databasens id...
  date: Date;
  timeInClip: number;
  timeInChain: number;
  text: string;
  soundfileId: number;

  constructor(id: number | undefined,
              date: Date,
              timeInClip: number,
              timeInChain: number,
              text: string,
              soundfileId: number) {
    this.id = id;
    this.date = date;
    this.timeInClip = timeInClip;
    this.timeInChain = timeInChain;
    this.text = text;
    this.soundfileId = soundfileId;
  }

  // Function to create note from json object. Throw error if json object is not valid
  static fromJson(json: any): Note {
    if (json.id === undefined ||
        json.time_stamp === undefined ||
        json.time_file === undefined ||
        json.time_chain === undefined ||
        json.text === undefined) {
      throw new Error("Invalid json object");
    }
    console.log(json.time_stamp, json.time);
    return new Note(json.id,
                    new Date(json.time_stamp*1000),
                    json.time_file,
                    json.time_chain,
                    json.text,
                    json.sound_file_id);
  }

  public getLocalDate(): string {
    return this.date.toLocaleDateString('sv-SE');
  }

  public setText(text: string): void {
    this.text = text;
  }
}

export default Note;
