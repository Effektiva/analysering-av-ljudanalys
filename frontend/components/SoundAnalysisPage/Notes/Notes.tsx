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

/**
 * Notes is a component that displays a list of notes. It also has a form for adding new notes.
 * @returns A list of notes and a form for adding new notes.
 */
const Notes = () => {
  const [notes, setNotes] = useState(DUMMY_NOTES);
  const [id, setId] = useState(1); // TODO: Delete this..

  /**
   * Adds a new note to the list of notes. The note is created from the values in the form and then sent to the backend.
   */
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

  /**
   * Deletes a note from the list of notes.
   * @param noteId - The id of the note to delete.
   */
  const deleteNote = (noteId: number | undefined) => {
    log.debug("Delete note: " + noteId);
    let newNotes = notes.filter((note) => {
      return note.id !== noteId
    });
    setNotes(newNotes);
  };

  /**
   * Saves the edited text of a note.
   * @param noteId - The id of the note to save the edited text of.
   * @param text - The text to save to the note.
   */
  const saveNewNoteText = (noteId: number | undefined, text: string) => {
    log.debug("saved note: " + noteId + " with text: " + text);
    let note = notes.find((note) => {
      return note.id === noteId;
    });
    note?.setText(text);
    // replace note in notes
    let newNotes = notes.filter((note) => {
      return note.id !== noteId
    });
    setNotes([...newNotes, note].sort((a, b) => a.timeInClip.getTime() - b.timeInClip.getTime()));
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
