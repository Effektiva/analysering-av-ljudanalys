import { LOG as log } from "@/pages/_app";

// Class to represent notes containing id, date and time that the note was created and a text for the note
class Note {
    id: number; // TODO: Denna ska inte vi skapa utan den ska komma från Databasens id...
    date: Date;
    timeInClip: string;
    text: string;

    constructor(id: number, date: Date, timeInClip: string, text: string) {
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
        return new Note(json.id, new Date(json.date), json.time, json.text);
    }

    public getLocalDate(): string {
        return this.date.toLocaleDateString('sv-SE');
    }
}

export default Note;
