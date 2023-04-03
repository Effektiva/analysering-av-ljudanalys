import { useState } from "react";

type Props = {
  notes: Array<any>,
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
  const [notes, setNotes] = useState(props.notes)

  return (
    <div className={Style.Container}>
      {
        notes.map(note => {
          return <div key={note.id} className={Style.Note}>
                  <div>
                    <div className={Style.Header}>
                      <span className={Style.Date}>Skriven {note.date}</span>
                      <span className={Style.Time}>Tid i klipp: {note.time}</span>
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
