import TimeInClip from "./TimeInClip";

// Class to represent notes containing id, date and time that the note was created and a text for the note
class Note {
  id: number | undefined; // TODO: Denna ska inte vi skapa utan den ska komma från Databasens id...
  date: Date;
  timeInClip: TimeInClip;
  text: string;

  constructor(id: number | undefined, date: Date, timeInClip: TimeInClip, text: string) {
    this.id = id;
    this.date = date;
    this.timeInClip = timeInClip;
    this.text = text;
  }

  // Function to create note from json object. Throw error if json object is not valid
  static fromJson(json: any): Note {
    if (json.id === undefined || json.date === undefined || json.time === undefined || json.text === undefined) {
      throw new Error("Invalid json object");
    }
    return new Note(json.id, new Date(json.date), TimeInClip.fromTimeString(json.time), json.text);
  }

  public getLocalDate(): string {
    return this.date.toLocaleDateString('sv-SE');
  }

  public setText(text: string): void {
    this.text = text;
  }
}

export default Note;
