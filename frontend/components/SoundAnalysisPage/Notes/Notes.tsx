import { useState } from "react";
import NotesList from "./NoteList";
import { LOG as log } from "@/pages/_app";
import Note from "@/models/SoundAnalysis/Note";
import APIService from "@/models/APIService";
import AppState from "@/state/AppState";

type Props = {
  clipZoom: boolean,
  appState: AppState,
  notes: Array<Note>,
  setNotes: Function,
}

const STYLE_NAMESPACE = "notes__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
  Top = STYLE_NAMESPACE + "top",
  Header = STYLE_NAMESPACE + "header",
  NewButton = STYLE_NAMESPACE + "newButton",
  NewNote = STYLE_NAMESPACE + "newNote",
  NewNoteTop = STYLE_NAMESPACE + "newNoteTop",
  NewNoteBody = STYLE_NAMESPACE + "newNoteBody",
  NewNoteTime = STYLE_NAMESPACE + "newNoteTime",
  NewNoteText = STYLE_NAMESPACE + "newNoteText",
}

/**
 * Notes is a component that displays a list of notes. It also has a form for adding new notes.
 * @returns A list of notes and a form for adding new notes.
 */
const Notes = (props: Props) => {
  const [showNewNote, setShowNewNote] = useState<boolean>(false);

  /**
   * Adds a new note to the list of notes. The note is created from the values in the form and then sent to the backend.
   */
  const addNewNote = async () => {
    const timeElement = document.getElementById("newNoteTime") as HTMLInputElement | null;
    const textAreaElement = document.getElementById("newNoteText") as HTMLTextAreaElement | null;
    let timeString = timeElement?.value!;
    let time = 0;

    if (textAreaElement?.value == "") {
      log.warning("Can't create empty note.");
      return;
    }

    if (timeString) {
      let split = timeString.split(":");
      time = parseInt(split[0])*60 + parseInt(split[1]);
    }

    let maxTime = props.appState.selectedSoundclip?.audioElement?.duration;
    let currentTime = props.appState.selectedSoundclip?.audioElement?.currentTime;
    // use the current time of the clip if no time is given
    if (time == 0 && currentTime != undefined) {
      time = props.appState.selectedSoundclip?.audioElement?.currentTime!;
    } else if (time < 0 || (maxTime && time > maxTime)) {
      log.warning("Trying to add a note with time (", time, ") that'll surpass max time (", maxTime, ") of currently playing clip.");
      return;
    }

    let newNote = await APIService.addComment(props.appState.selectedInvestigation!.id!,
                                              props.appState.selectedSoundChain!.id!,
                                              props.appState.selectedSoundclip!.id!,
                                              Math.round(time),
                                              textAreaElement!.value);
    let note = Note.fromJson(newNote);
    if (note != undefined) {
      let sortedNotes = [...props.notes, note].sort((a, b) => a.timeInClip - b.timeInClip);
      props.setNotes(sortedNotes);
    } else {
      log.warning("Backend couldn't create comment.")
    }
  };

  /**
   * Deletes a note from the list of notes.
   * @param noteId - The id of the note to delete.
   */
  const deleteNote = (noteId: number | undefined) => {
    let newNotes = props.notes.filter((note) => {
      return note.id !== noteId
    });
    props.setNotes(newNotes);
    APIService.deleteComment(
      props.appState.selectedInvestigation!.id!,
      props.appState.selectedSoundChain!.id!,
      noteId!
    ).catch((error) => {
      log.warning("Couldn't delete comment with id", noteId, ":", error);
    });
  };

  /**
   * Saves the edited text of a note.
   * @param noteId - The id of the note to save the edited text of.
   * @param text - The text to save to the note.
   */
  const saveNewNoteText = (noteId: number | undefined, text: string) => {
    let note = props.notes.find((note) => {
      return note.id === noteId;
    });
    if (note === undefined) {
      return;
    }
    note.setText(text);
    // replace note in notes
    let newNotes = props.notes.filter((note) => {
      return note.id !== noteId
    });
    let sortedNotes = [...newNotes, note].sort((a, b) => a.timeInClip - b.timeInClip);
    props.setNotes(sortedNotes);
    APIService.updateComment(
      props.appState.selectedInvestigation!.id!,
      props.appState.selectedSoundChain!.id!,
      noteId!,
      text
    ).catch((error) => {
      log.warning("Couldn't update comment with id", noteId, ":", error);
    });
  }

  return (
    <div className={Style.Container}>
      <div className={Style.Top}>
        <h2 className={Style.Header}>Anteckningar</h2>
        <button
          className={Style.NewButton}
          onClick={() => {setShowNewNote(!showNewNote)}}
        >
          {showNewNote ? "Stäng ny anteckning" : "Skapa ny anteckning"}
        </button>
      </div>
      <div className={Style.NewNote + (showNewNote ? "" : " collapsed")} aria-describedby="newNoteHead">
        <div className={Style.NewNoteTop}>
          <h3 id="newNoteHead">Skapa ny anteckning</h3>
        </div>
        <div className={Style.NewNoteBody}>
          <div className={Style.NewNoteTime}>
            <div>
              <label htmlFor="newNoteTime">Tidpunkt i klipp</label>:
              <input
                id="newNoteTime"
                placeholder="00:00"
              />
            </div>
            <p>(tomt innebär nuvarande tid)</p>
          </div>
          <div className={Style.NewNoteText}>
            <textarea id="newNoteText" placeholder="Skriv här" aria-label="Anteckningar"/>
          </div>
          <button onClick={addNewNote}>Lägg till</button>
        </div>
      </div>
      <NotesList
        clipZoom={props.clipZoom}
        notes={props.notes}
        deleteNote={deleteNote}
        setNoteText={saveNewNoteText}
      />
    </div>
  );
}

export default Notes;
