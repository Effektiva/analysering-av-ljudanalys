import { DUMMY_NOTES } from "@/modules/DummyData";
import { useState } from "react";
import NotesList from "./NoteList";
import { LOG as log } from "@/pages/_app";
import Note from "@/models/SoundAnalysis/Note";

const STYLE_NAMESPACE = "notes__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
  Header = STYLE_NAMESPACE + "header",
}

const Notes = () => {
  const [notes, setNotes] = useState(DUMMY_NOTES)

  let id: number = 1;

  const addNewNote = () => {
    log.debug("New note...");
    const timeElement = document.getElementById('newNoteTime') as HTMLInputElement | null;
    const textAreaElement = document.getElementById('newNoteText') as HTMLTextAreaElement | null;


    if (timeElement?.value == null && textAreaElement?.value == null) {
      log.debug("Something wong man...");
      return;
    }
    log.debug("Errything good...");
    // Find the highest id in the array and add 1 to it
    let lastId = id++;
    log.debug("Last id" + lastId);
    let note = new Note(lastId + 1, new Date(), new Date(timeElement!.value), textAreaElement!.value);
    log.debug("New note" + note);
    setNotes(notes + note);
  }

  return (
    <div className={Style.Container}>
      <div className={Style.Header}>Anteckningar</div>
      Tidpunkt: <input id="newNoteTime" placeholder="6969" /><br />
      Anteckning: <textarea id="newNoteText" placeholder="Text" /><br />
      <button onClick={addNewNote}>Lägg till</button>

      <NotesList notes={notes} />
    </div>
  );
}

export default Notes;
