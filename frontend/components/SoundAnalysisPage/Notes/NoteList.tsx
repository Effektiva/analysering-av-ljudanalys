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

const buttonStyle = { width: '20px', height: '20px', padding: '0' }
const imageStyle = { width: '100%', height: '100%', marginTop: '-12px', padding: '1px' };

const NotesList = (props: Props) => {
  const [editingNoteId, setEditingNote] = useState<number | undefined>(undefined);

  const setEditingNoteId = (noteId: number | undefined) => {
    log.debug("Editing note: " + noteId);
    setEditingNote(noteId);
  }

  const saveEditedText = (noteId: number | undefined) => {
    // find element with id noteId
    setEditingNoteId(undefined);
    const divElement = document.getElementById(""+noteId) as HTMLDivElement | null;
    // Get first child of divElement
    const textArea = divElement?.firstChild as HTMLTextAreaElement | null;
    if (textArea != null) {
      log.debug("Editing note: " + noteId + " with text: " + textArea?.textContent);
      // set text
      props.setNoteText(noteId, textArea.textContent);
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
                      <>{editingNoteId === note.id ? <button onClick={() => saveEditedText(note.id) } style={buttonStyle}><img src="/save.png" alt="Save"  style={imageStyle}/></button> : <button onClick={() => setEditingNoteId(note.id) } style={buttonStyle}><img src="/edit.png" alt="Edit"  style={imageStyle}/></button> }</>
                      <button
                        onClick={() => props.deleteNote(note.id)}
                        style={buttonStyle}
                      >
                        <img src="/delete.png" alt="Delete" style={imageStyle}/>
                      </button>

                    </div>
                  </div>
                  <div id={note.id} className={Style.Text}>
                   <EditableTextField defaultText={note.text} isEditing={editingNoteId === note.id}/>
                  </div>
                 </div>
        })
      }
    </div>
  );
}

export default NotesList;
