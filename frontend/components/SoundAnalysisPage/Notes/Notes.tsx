import { DUMMY_NOTES } from "@/modules/DummyData";
import { useState } from "react";
import NotesList from "./NoteList";
import { LOG as log } from "@/pages/_app";
import Note from "@/models/SoundAnalysis/Note";
import TimeInClip from "@/models/SoundAnalysis/TimeInClip";

const STYLE_NAMESPACE = "notes__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
  Header = STYLE_NAMESPACE + "header",
}

const Notes = () => {
  const [notes, setNotes] = useState(DUMMY_NOTES);
  const [id, setId] = useState(1); // TODO: Delete this..

  const addNewNote = () => {
    const timeElement = document.getElementById('newNoteTime') as HTMLInputElement | null;
    const textAreaElement = document.getElementById('newNoteText') as HTMLTextAreaElement | null;

    if (timeElement?.value == null && textAreaElement?.value == null) {
      log.debug("Something wong man...");
      return;
    }
    setId(id + 1);
    try {
      let note = new Note(id + 1, new Date(), TimeInClip.fromTimeString(timeElement!.value), textAreaElement!.value); // Dont care about id since we should not set it here... TODO: Fix this...
      setNotes([...notes, note].sort((a, b) => a.timeInClip.getTime() - b.timeInClip.getTime()));
    } catch (error) {
      log.warning("Got error: " + error);
    }
  };

  const deleteNote = (noteId: number | undefined) => {
    log.debug("Delete note: " + noteId);
    let newNotes = notes.filter((note) => {
      return note.id !== noteId
    });
    setNotes(newNotes);
  };

  const saveNewNoteText = (noteId: number | undefined, text: string) => {
    log.debug("saved note: " + noteId + " with text: " + text);
    
  }

  return (
    <div className={Style.Container}>
      <div className={Style.Header}>Anteckningar</div>
      Tidpunkt: <input id="newNoteTime" placeholder="12:34" /><br />
      Anteckning: <textarea id="newNoteText" placeholder="Anteckningar" /><br />
      <button onClick={addNewNote}>Lägg till</button>

      <NotesList notes={notes} deleteNote={deleteNote} setNoteText={saveNewNoteText} />
    </div>
  );
}

export default Notes;
