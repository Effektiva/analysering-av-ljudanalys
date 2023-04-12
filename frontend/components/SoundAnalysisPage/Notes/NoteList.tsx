import Note from "@/models/SoundAnalysis/Note";
import EditableTextField from "./EditableTextField";
import { useState } from "react";
import { LOG as log } from "@/pages/_app";

type Props = {
  notes: Array<Note>,
  deleteNote: (noteId: number | undefined) => void,
  setNoteText: (noteId: number | undefined, text: string) => void
}

const STYLE_NAMESPACE = "notes__list__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
  Header = STYLE_NAMESPACE + "header",
  Note = STYLE_NAMESPACE + "note",
  Date = STYLE_NAMESPACE + "date",
  Time = STYLE_NAMESPACE + "time",
  Text = STYLE_NAMESPACE + "text",
}

/**
 * NotesList is a list of notes. It displays the date, time and text of the note. It also has buttons for editing and deleting the note.
 * @param props - The notes to display, a function for deleting a note and a function for setting the text of a note.
 * @returns A list of notes.
 */
const NotesList = (props: Props) => {
  const [editingNoteId, setEditingNote] = useState<number | undefined>(undefined);

  /**
   * Sets the id of the note that is being edited.
   * @param noteId - The id of the note to edit.
   */
  const setEditingNoteId = (noteId: number | undefined) => {
    log.debug("Editing note: " + noteId);
    setEditingNote(noteId);
  }

  /**
   * Saves the edited text of a note. The text is saved by calling the setNoteText function that is passed in as a prop.
   * @param noteId - The id of the note to save the edited text of.
   */
  const saveEditedText = (noteId: number | undefined) => {
    setEditingNoteId(undefined);
    const divElement = document.getElementById(""+noteId) as HTMLDivElement | null;
    const textArea = divElement?.firstChild as HTMLTextAreaElement | null;
    if (textArea != null) {
      log.debug("Editing note: " + noteId + " with text: " + textArea?.textContent);
      props.setNoteText(noteId, textArea.textContent ?? "");
    } else {
      log.debug("Could not find textArea for note: " + noteId);
    }
  }

  return (
    <div className={Style.Container}>
      {
        props.notes.map(note => {
          return <div key={note.id} className={Style.Note}>
                  <div>
                    <div className={Style.Header}>
                      <span className={Style.Date}>Skriven {note.getLocalDate()}</span>
                      <span className={Style.Time}>Tid i klipp: {note.timeInClip.formattedString()}</span>
                      <>{editingNoteId === note.id ? <button onClick={() => saveEditedText(note.id) }><img src="/save.png" alt="Save"/></button> : <button onClick={() => setEditingNoteId(note.id) }><img src="/edit.png" alt="Edit"/></button> }</>
                      <button
                        onClick={() => props.deleteNote(note.id)}
                      >
                        <img src="/delete.png" alt="Delete"/>
                      </button>

                    </div>
                  </div>
                  <div id={""+note.id} className={Style.Text}>
                   <EditableTextField defaultText={note.text} isEditing={editingNoteId === note.id}/>
                  </div>
                 </div>
        })
      }
    </div>
  );
}

export default NotesList;
