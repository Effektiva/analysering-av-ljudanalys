import Note from "@/models/SoundAnalysis/Note";
import { useState } from "react";
import { LOG as log } from "@/pages/_app";

type Props = {
  notes: Array<Note>,
  deleteNote: (noteId: number | undefined) => void
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

  return (
    <div className={Style.Container}>
      {
        props.notes.map(note => {
          return <div key={note.id} className={Style.Note}>
                  <div>
                    <div className={Style.Header}>
                      <span className={Style.Date}>Skriven {note.getLocalDate()}</span>
                      <span className={Style.Time}>Tid i klipp: {note.timeInClip.formattedString()}</span>
                      <button onClick={() => setEditingNoteId(note.id) } style={buttonStyle}>
                      <img src="/edit.png" alt="Edit"  style={imageStyle}/>
                      </button>
                      <button
                        onClick={() => props.deleteNote(note.id)}
                        style={buttonStyle}
                      >
                        <img src="/delete.png" alt="Delete" style={imageStyle}/>
                      </button>

                    </div>
                  </div>
                  <div className={Style.Text}>
                    <>{editingNoteId === note.id ? <textarea defaultValue={note.text}></textarea> : <>{note.text}</>}</>
                  </div>
                 </div>
        })
      }
    </div>
  );
}

export default NotesList;
