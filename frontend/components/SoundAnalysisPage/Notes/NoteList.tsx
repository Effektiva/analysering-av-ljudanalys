import Note from "@/models/SoundAnalysis/Note";
import EditableTextField from "./EditableTextField";
import { useState } from "react";
import { LOG as log } from "@/pages/_app";
import { FaSave as IconSave,
         FaTrash as IconDelete,
         FaEdit as IconEdit             } from "react-icons/fa";

type Props = {
  clipZoom: boolean,
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
  Buttons = STYLE_NAMESPACE + "buttons",
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
    setEditingNote(noteId);
  }

  /**
   * Saves the edited text of a note. The text is saved by calling the setNoteText function that is passed in as a prop.
   * @param noteId - The id of the note to save the edited text of.
   */
  const saveEditedText = (noteId: number | undefined) => {
    const divElement = document.getElementById("note_"+noteId) as HTMLDivElement | null;
    const textArea = divElement?.firstChild as HTMLTextAreaElement | null;
    if (textArea != null) {
      log.debug(textArea.textContent);
      props.setNoteText(noteId, textArea.textContent ?? "");
    } else {
      log.debug("Could not find textArea for note: " + noteId);
    }
    setEditingNoteId(undefined);
  }

  const formatSeconds = (seconds: number): string => {
    if (seconds == undefined) {
      return "--:--:--";
    }

    return new Date(seconds*1000).toISOString().slice(11, 19);
  }

  return (
    <div className={Style.Container}>
      {
        props.notes.map(note => {
          return  <div key={note.id} className={Style.Note}>
                    <div className={Style.Header}>
                      <span className={Style.Date}>Skriven {note.getLocalDate()}</span>
                      { props.clipZoom ?
                        <span className={Style.Time}>Tid i klipp: {formatSeconds(note.timeInClip)}</span>
                        :
                        <span className={Style.Time}>Tid i kedja: {formatSeconds(note.timeInChain)}</span>
                      }
                    </div>
                    <div id={"note_"+note.id} className={Style.Text}>
                      <EditableTextField defaultText={note.text} isEditing={editingNoteId === note.id}/>
                      <div className={Style.Buttons}>
                        <>
                          {editingNoteId === note.id
                            ?
                              <button onClick={() => saveEditedText(note.id) }>
                                <IconSave />
                              </button>
                            :
                              <button onClick={() => setEditingNoteId(note.id) }>
                                <IconEdit />
                              </button>
                          }
                        </>
                        <button onClick={() => props.deleteNote(note.id)} disabled={editingNoteId === note.id}>
                          <IconDelete />
                        </button>
                    </div>
                  </div>
                </div>
        })
      }
    </div>
  );
}

export default NotesList;
