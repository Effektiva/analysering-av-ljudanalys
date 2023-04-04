import Note from "@/models/SoundAnalysis/Note";
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

const NotesList = (props: Props) => {

  return (
    <div className={Style.Container}>
      {
        props.notes.map(note => {
          return <div key={note.id} className={Style.Note}>
                  <div>
                    <div className={Style.Header}>
                      <span className={Style.Date}>Skriven {note.getLocalDate()}</span>
                      <span className={Style.Time}>Tid i klipp: {note.timeInClip.formattedString()}</span>
                      <button onClick={() => props.deleteNote(note.id)}>Delete blyat</button>
                    </div>
                  </div>
                  <div className={Style.Text}>
                    {note.text}
                  </div>
                 </div>
        })
      }
    </div>
  );
}

export default NotesList;
