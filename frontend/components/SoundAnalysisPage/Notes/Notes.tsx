import { useEffect, useState } from "react";
import NotesList from "./NoteList";
import { LOG as log } from "@/pages/_app";
import Note from "@/models/SoundAnalysis/Note";
import TimeInClip from "@/models/SoundAnalysis/TimeInClip";
<<<<<<< HEAD
import axios from "axios";
=======
import SoundChain from "@/models/General/SoundChain";

type Props = {
  soundchain: SoundChain,
  soundchainCommentsUpdated: (newNotes: Array<Note>) => void,
}
>>>>>>> 486864033e6cb2148ff778f856214a161ac3683d

const STYLE_NAMESPACE = "notes__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
  Header = STYLE_NAMESPACE + "header",
  NewNote = STYLE_NAMESPACE + "newnote",
  NewNoteTime = STYLE_NAMESPACE + "newnote_time",
  NewNoteText = STYLE_NAMESPACE + "newnote_text",
}

/**
 * Notes is a component that displays a list of notes. It also has a form for adding new notes.
 * @returns A list of notes and a form for adding new notes.
 */
const Notes = (props: Props) => {
  const [notes, setNotes] = useState(props.soundchain.comments);
  const [id, setId] = useState(1); // TODO: Delete this..

  useEffect(() => {
    props.soundchainCommentsUpdated(notes);
  }, [notes]);

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
<<<<<<< HEAD
      let note = new Note(id + 1, new Date(), TimeInClip.fromTimeString(timeElement!.value), textAreaElement!.value); // Dont care about id since we should not set it here... TODO: Fix this...

      // First axios call test. This is wewy scawy UwU, Använder postman istället
      /*
      axios.post('http://localhost:8000/investigations', {
        "name": "Fungerar jag?"
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
      */

      setNotes([...notes, note].sort((a, b) => a.timeInClip.getTime() - b.timeInClip.getTime()));
=======
      let note = new Note(id + 1, new Date(), TimeInClip.fromTimeString(timeElement!.value), textAreaElement!.value); // Dont care about id since we should not set it here... TODO: Fix this...\
      let sortedNotes = [...notes, note].sort((a, b) => a.timeInClip.getTime() - b.timeInClip.getTime());
      setNotes(sortedNotes);
>>>>>>> 486864033e6cb2148ff778f856214a161ac3683d
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
    if (note === undefined) {
      return;
    }
    note.setText(text);
    // replace note in notes
    let newNotes = notes.filter((note) => {
      return note.id !== noteId
    });
    let sortedNotes = [...newNotes, note].sort((a, b) => a.timeInClip.getTime() - b.timeInClip.getTime());
    setNotes(sortedNotes);
  }

  return (
    <div className={Style.Container}>
      <h2 className={Style.Header}>Anteckningar</h2>
      <div className={Style.NewNote} aria-describedby="newNoteHead">
        <div>
          <h3 id="newNoteHead">Skapa ny anteckning</h3>
          <div className={Style.NewNoteTime}>
            <label htmlFor="newNoteTime">Tidpunkt:</label>
            <input id="newNoteTime" placeholder="12:34" />
          </div>
        </div>
        <div>
          <div className={Style.NewNoteText}>
            <label htmlFor="newNoteText">Anteckning:</label>
            <textarea id="newNoteText" placeholder="Anteckningar" />
          </div>
          <button onClick={addNewNote}>Lägg till</button>
        </div>
      </div>
      <NotesList notes={notes} deleteNote={deleteNote} setNoteText={saveNewNoteText} />
    </div>
  );
}

export default Notes;
